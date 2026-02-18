# -*- coding: utf-8 -*-
"""
Анализатор поисковых запросов для B2B кампаний Яндекс.Директ
Замена bid_manager.py — вместо управления ставками анализирует
поисковые запросы и автоматически добавляет минус-слова.

Функции:
1. Получение отчёта по поисковым запросам (SEARCH_QUERY_PERFORMANCE_REPORT)
2. Классификация запросов: B2B-целевой / мусор / под вопросом
3. Автодобавление минус-слов на уровень кампании
4. Отчёт в Telegram
"""

import re
import json
import time
from datetime import datetime, timedelta
from typing import Dict, List, Tuple, Optional
from pathlib import Path
from dataclasses import dataclass, field

from yandex_direct_api import YandexDirectAPI


# ─── Кампании ───────────────────────────────────────────────
B2B_CAMPAIGN_IDS = [705839254, 705839266]  # Hot + Geo

# ─── Паттерны для классификации ─────────────────────────────

# Однозначно мусорные запросы — сразу в минус-слова
JUNK_PATTERNS = [
    # Трудоустройство
    r"\b(вакансия|вакансии|зарплата|работа\b|подработка|устроиться|резюме|"
    r"требуется|стажировка|hh\.ru|headhunter|трудоустр)",
    # Конкуренты / агрегаторы
    r"\b(blablacar|блаблакар|gett|ситимобил|яндекс\s*такси|яндекс\s*go|"
    r"делимобиль|яндекс\s*драйв|kiwi|gettransfer|intui|wheely|максим\s+такси|"
    r"uber|убер\b|индрайвер|indriver|bolt\b|didi)",
    # Нерелевантный транспорт (поезд\b чтобы не ловить "поездка/поездок")
    r"\b(автобус\w*|поезд\b|поездов\b|поездом\b|электричк\w*|маршрутк\w*|"
    r"эвакуатор\w*|авиа\w*|самолет\w*|паром\b|метро\b|троллейбус|трамвай|"
    r"фура\b|газель\b|ж\.?д\.?\b)",
    # Туризм / личное
    r"\b(свадьба|похороны|роддом|детское\s*кресло|горнолыжка|экскурсия|"
    r"туризм|отпуск|турпоездка|путевка|санаторий|пляж|море\b)",
    # Дешевизна
    r"\b(бесплатно|халява|промокод|купон|скидка\s+\d+%)",
    # Приложения / обзоры
    r"\b(скачать|приложение|отзывы\b|рейтинг|форум|википедия|youtube|ютуб)",
    # Обучение
    r"\b(обучение|курсы|автошкола|лекция|диплом\b)",
    # Грузоперевозки
    r"\b(грузоперевоз|грузчик|грузовой|переезд|мебел|холодильник)",
    # Ритуальные / медицинские авто
    r"\b(катафалк|ритуальн|скорая\s*помощь)",
    # Каршеринг / прокат
    r"\b(каршеринг|прокат\s+авто|аренда\s+авто|car\s*sharing)",
    # Животные
    r"\b(кошка|кошку|собака|собаку|животн|питомец)",
    # C2C-маркеры (если попали в B2B кампанию)
    r"\b(попутка|попутчик|подвезти|подвоз\b)",
]

# B2B-маркеры — запросы с ними точно целевые
B2B_MARKERS = [
    r"\b(корпоратив|для\s+бизнес|для\s+компан|для\s+организац|для\s+юрлиц|"
    r"юридическ|юрлицо|для\s+сотрудник)",
    r"\b(договор|по\s+счету|по\s+счёту|безнал|постоплата|нал\s+безнал|"
    r"закрывающ|документ|акт\b|упд\b|эдо\b|бухгалтер|счет-фактур|"
    r"авансов|отчет|чек\s+qr|реестр\s+поезд)",
    r"\b(командировк|делегаци|конференц|семинар|форум|мероприят|выставк)",
    r"\b(вахт|бригад|монтажник|строител|перевозка\s+рабочих|"
    r"доставка\s+бригад|развозка\s+сотрудник)",
    r"\b(медицинск|медперсонал|пациент|клиник|фарм)",
    r"\b(трансфер|межгород|междугородн)",
    r"\b(ндс|оплата\s+по\s+реквизит|тендер|закупк|госзакупк)",
]

# Слова-кандидаты в минус, если нет B2B-маркеров рядом
SUSPICIOUS_PATTERNS = [
    r"\b(дешев|недорого|эконом|бюджетн)",
    r"\b(лимузин|вип|vip|премиум|бизнес.класс)",
    r"\b(аэропорт|вокзал|жд\s*вокзал)",
    r"\b(такси\s+москва|такси\s+спб)\b",  # слишком общие
]


@dataclass
class QueryAnalysis:
    """Результат анализа одного запроса"""
    query: str
    impressions: int
    clicks: int
    cost: float
    ctr: float
    campaign_id: int
    classification: str  # "junk", "b2b", "suspicious", "unknown"
    matched_pattern: str = ""


@dataclass
class AnalysisReport:
    """Сводный отчёт"""
    period_days: int
    total_queries: int = 0
    total_cost: float = 0
    junk_queries: List[QueryAnalysis] = field(default_factory=list)
    b2b_queries: List[QueryAnalysis] = field(default_factory=list)
    suspicious_queries: List[QueryAnalysis] = field(default_factory=list)
    unknown_queries: List[QueryAnalysis] = field(default_factory=list)
    new_negatives_added: List[str] = field(default_factory=list)
    existing_negatives_skipped: int = 0


class QueryAnalyzer:
    """Анализатор поисковых запросов"""

    HISTORY_FILE = Path(__file__).parent / "reports" / "query_history.json"

    def __init__(self):
        self.api = YandexDirectAPI()
        self._junk_re = [re.compile(p, re.IGNORECASE) for p in JUNK_PATTERNS]
        self._b2b_re = [re.compile(p, re.IGNORECASE) for p in B2B_MARKERS]
        self._suspicious_re = [re.compile(p, re.IGNORECASE) for p in SUSPICIOUS_PATTERNS]
        self._history = self._load_history()

    # ─── Получение данных ───────────────────────────────────

    def get_search_queries(self, campaign_ids: List[int],
                           days: int = 7) -> List[Dict]:
        """Получить отчёт по поисковым запросам."""
        date_from = (datetime.now() - timedelta(days=days)).strftime("%Y-%m-%d")
        date_to = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")

        print(f"Запрашиваю отчёт: {date_from} — {date_to}")

        report = self.api.get_report(
            report_type="SEARCH_QUERY_PERFORMANCE_REPORT",
            date_from=date_from,
            date_to=date_to,
            field_names=[
                "CampaignId", "Query", "Impressions", "Clicks",
                "Cost", "Ctr", "AvgCpc",
            ],
            campaign_ids=campaign_ids,
        )

        rows = []
        lines = report.strip().split("\n")
        if len(lines) < 2:
            return rows

        headers = lines[0].split("\t")
        for line in lines[1:]:
            vals = line.split("\t")
            if len(vals) != len(headers):
                continue
            row = dict(zip(headers, vals))
            rows.append(row)

        print(f"Получено строк: {len(rows)}")
        return rows

    def get_current_negatives(self, campaign_ids: List[int]) -> set:
        """Получить текущие минус-слова кампаний."""
        import requests
        negatives = set()
        headers = {
            "Authorization": f"Bearer {self.api.token}",
            "Accept-Language": "ru",
        }
        r = requests.post(
            self.api.base_url + "campaigns",
            json={
                "method": "get",
                "params": {
                    "SelectionCriteria": {"Ids": campaign_ids},
                    "FieldNames": ["Id", "NegativeKeywords"],
                }
            },
            headers=headers,
        )
        data = r.json().get("result", {}).get("Campaigns", [])
        for c in data:
            nk = c.get("NegativeKeywords", {})
            if isinstance(nk, dict):
                for w in nk.get("Items", []):
                    negatives.add(w.lower().strip())
            elif isinstance(nk, list):
                for w in nk:
                    negatives.add(w.lower().strip())
        return negatives

    # ─── Классификация ──────────────────────────────────────

    def classify_query(self, query: str) -> Tuple[str, str]:
        """
        Классифицировать поисковый запрос.

        Returns:
            (classification, matched_pattern)
        """
        q = query.lower().strip()

        # Сначала проверяем B2B-маркеры (приоритет)
        for pattern in self._b2b_re:
            m = pattern.search(q)
            if m:
                return ("b2b", m.group())

        # Затем мусорные
        for pattern in self._junk_re:
            m = pattern.search(q)
            if m:
                return ("junk", m.group())

        # Подозрительные (только если нет B2B-маркеров)
        for pattern in self._suspicious_re:
            m = pattern.search(q)
            if m:
                return ("suspicious", m.group())

        return ("unknown", "")

    # ─── Извлечение минус-слов ──────────────────────────────

    def extract_negative_word(self, query: str, matched: str) -> Optional[str]:
        """
        Извлечь минус-слово из мусорного запроса.
        Возвращает одно ключевое минус-слово, а не весь запрос.
        """
        # Берём совпавшее слово как минус
        word = matched.strip().lower()

        # Убираем слишком короткие
        if len(word) < 3:
            return None

        # Если это составное выражение — берём основное слово
        parts = word.split()
        if len(parts) > 2:
            return parts[0]  # первое слово

        return word

    # ─── Основной анализ ────────────────────────────────────

    def analyze(self, campaign_ids: List[int] = None,
                days: int = 7,
                auto_add: bool = False) -> AnalysisReport:
        """
        Полный анализ поисковых запросов.

        Args:
            campaign_ids: ID кампаний (по умолчанию — B2B)
            days: Период анализа
            auto_add: Автоматически добавлять минус-слова

        Returns:
            AnalysisReport
        """
        if campaign_ids is None:
            campaign_ids = B2B_CAMPAIGN_IDS

        report = AnalysisReport(period_days=days)

        # 1. Получаем запросы
        queries = self.get_search_queries(campaign_ids, days)
        if not queries:
            print("Нет данных по поисковым запросам")
            return report

        # 2. Получаем текущие минус-слова
        existing_negatives = self.get_current_negatives(campaign_ids)
        print(f"Текущих минус-слов: {len(existing_negatives)}")

        # 3. Классифицируем каждый запрос
        new_negatives = set()

        for row in queries:
            try:
                query_text = row.get("Query", "")
                impressions = int(row.get("Impressions", 0))
                clicks = int(row.get("Clicks", 0))
                cost = float(row.get("Cost", 0))
                ctr = float(row.get("Ctr", 0))
                cid = int(row.get("CampaignId", 0))
            except (ValueError, TypeError):
                continue

            classification, matched = self.classify_query(query_text)

            qa = QueryAnalysis(
                query=query_text,
                impressions=impressions,
                clicks=clicks,
                cost=cost,
                ctr=ctr,
                campaign_id=cid,
                classification=classification,
                matched_pattern=matched,
            )

            report.total_queries += 1
            report.total_cost += cost

            if classification == "junk":
                report.junk_queries.append(qa)
                # Извлекаем минус-слово
                neg = self.extract_negative_word(query_text, matched)
                if neg and neg not in existing_negatives:
                    new_negatives.add(neg)
                elif neg:
                    report.existing_negatives_skipped += 1

            elif classification == "b2b":
                report.b2b_queries.append(qa)
            elif classification == "suspicious":
                report.suspicious_queries.append(qa)
            else:
                report.unknown_queries.append(qa)

        # 4. Сортируем по расходу (самые дорогие мусорные — первыми)
        report.junk_queries.sort(key=lambda x: x.cost, reverse=True)
        report.suspicious_queries.sort(key=lambda x: x.cost, reverse=True)
        report.b2b_queries.sort(key=lambda x: x.cost, reverse=True)

        # 5. Добавляем минус-слова
        if new_negatives:
            report.new_negatives_added = sorted(new_negatives)

            if auto_add:
                self._add_negatives(campaign_ids, list(new_negatives),
                                    existing_negatives)

        # 6. Сохраняем историю
        self._save_to_history(report)

        return report

    def _add_negatives(self, campaign_ids: List[int],
                       new_words: List[str],
                       existing: set):
        """Добавить минус-слова к кампаниям."""
        merged = sorted(existing | set(new_words))

        # Лимит Директа — 4096 символов на минус-слова кампании
        total_len = sum(len(w) for w in merged)
        if total_len > 4000:
            print(f"ВНИМАНИЕ: {total_len} символов — близко к лимиту 4096!")

        for cid in campaign_ids:
            try:
                self.api.update_campaign(cid, NegativeKeywords={"Items": merged})
                print(f"Кампания {cid}: добавлено {len(new_words)} "
                      f"минус-слов (всего {len(merged)})")
            except Exception as e:
                print(f"Ошибка кампании {cid}: {e}")

    # ─── История ────────────────────────────────────────────

    def _load_history(self) -> dict:
        if self.HISTORY_FILE.exists():
            try:
                return json.loads(self.HISTORY_FILE.read_text(encoding="utf-8"))
            except Exception:
                return {"runs": [], "total_negatives_added": 0}
        return {"runs": [], "total_negatives_added": 0}

    def _save_to_history(self, report: AnalysisReport):
        self.HISTORY_FILE.parent.mkdir(parents=True, exist_ok=True)
        run = {
            "date": datetime.now().isoformat(),
            "period_days": report.period_days,
            "total_queries": report.total_queries,
            "junk": len(report.junk_queries),
            "b2b": len(report.b2b_queries),
            "suspicious": len(report.suspicious_queries),
            "new_negatives": report.new_negatives_added,
            "junk_cost": sum(q.cost for q in report.junk_queries),
        }
        self._history["runs"].append(run)
        self._history["total_negatives_added"] += len(report.new_negatives_added)
        self.HISTORY_FILE.write_text(
            json.dumps(self._history, ensure_ascii=False, indent=2),
            encoding="utf-8"
        )

    # ─── Форматирование отчётов ─────────────────────────────

    def format_report(self, report: AnalysisReport, short: bool = False) -> str:
        """Форматировать отчёт для Telegram."""
        lines = []
        lines.append(f"📊 *Анализ запросов за {report.period_days} дн.*\n")
        lines.append(f"Всего запросов: *{report.total_queries}*")
        lines.append(f"Общий расход: *{report.total_cost:.0f} ₽*\n")

        # Сводка
        junk_cost = sum(q.cost for q in report.junk_queries)
        b2b_cost = sum(q.cost for q in report.b2b_queries)
        lines.append(f"✅ B2B-целевые: {len(report.b2b_queries)} "
                      f"({b2b_cost:.0f} ₽)")
        lines.append(f"🚫 Мусорные: {len(report.junk_queries)} "
                      f"({junk_cost:.0f} ₽)")
        lines.append(f"⚠️ Подозрительные: {len(report.suspicious_queries)}")
        lines.append(f"❓ Неизвестные: {len(report.unknown_queries)}")

        if report.total_cost > 0 and junk_cost > 0:
            waste_pct = junk_cost / report.total_cost * 100
            lines.append(f"\n💸 *Слив бюджета: {waste_pct:.1f}%* ({junk_cost:.0f} ₽)")

        if not short:
            # Топ мусорных запросов
            if report.junk_queries:
                lines.append("\n*🚫 Топ мусорных запросов:*")
                for q in report.junk_queries[:10]:
                    lines.append(f"  `{q.query[:50]}` — "
                                 f"{q.clicks} кл., {q.cost:.0f}₽ "
                                 f"[{q.matched_pattern}]")

            # Топ подозрительных
            if report.suspicious_queries:
                lines.append("\n*⚠️ Подозрительные (проверь вручную):*")
                for q in report.suspicious_queries[:10]:
                    lines.append(f"  `{q.query[:50]}` — "
                                 f"{q.clicks} кл., {q.cost:.0f}₽")

            # Топ B2B
            if report.b2b_queries:
                lines.append("\n*✅ Топ B2B запросов:*")
                for q in report.b2b_queries[:10]:
                    lines.append(f"  `{q.query[:50]}` — "
                                 f"{q.clicks} кл., {q.cost:.0f}₽")

        # Новые минус-слова
        if report.new_negatives_added:
            lines.append(f"\n*🆕 Новые минус-слова ({len(report.new_negatives_added)}):*")
            lines.append(f"  `{', '.join(report.new_negatives_added[:20])}`")

        if report.existing_negatives_skipped:
            lines.append(f"↩️ Уже в минусах: {report.existing_negatives_skipped}")

        return "\n".join(lines)

    def format_report_plain(self, report: AnalysisReport) -> str:
        """Форматировать для консоли (без Markdown)."""
        lines = []
        lines.append("=" * 60)
        lines.append(f"АНАЛИЗ ПОИСКОВЫХ ЗАПРОСОВ ({report.period_days} дн.)")
        lines.append("=" * 60)
        lines.append(f"Всего запросов: {report.total_queries}")
        lines.append(f"Общий расход:   {report.total_cost:.2f} руб.")
        lines.append("")

        junk_cost = sum(q.cost for q in report.junk_queries)
        b2b_cost = sum(q.cost for q in report.b2b_queries)

        lines.append(f"B2B-целевые:    {len(report.b2b_queries):>5} "
                      f"({b2b_cost:>8.2f} руб.)")
        lines.append(f"Мусорные:       {len(report.junk_queries):>5} "
                      f"({junk_cost:>8.2f} руб.)")
        lines.append(f"Подозрительные: {len(report.suspicious_queries):>5}")
        lines.append(f"Неизвестные:    {len(report.unknown_queries):>5}")

        if report.total_cost > 0 and junk_cost > 0:
            lines.append(f"\nСлив бюджета: {junk_cost / report.total_cost * 100:.1f}%"
                          f" ({junk_cost:.2f} руб.)")

        if report.junk_queries:
            lines.append("\n--- МУСОРНЫЕ ЗАПРОСЫ (топ-15) ---")
            for q in report.junk_queries[:15]:
                lines.append(f"  {q.query[:55]:55} {q.clicks:>3}кл "
                              f"{q.cost:>7.2f}р  [{q.matched_pattern}]")

        if report.suspicious_queries:
            lines.append("\n--- ПОДОЗРИТЕЛЬНЫЕ (проверь вручную, топ-15) ---")
            for q in report.suspicious_queries[:15]:
                lines.append(f"  {q.query[:55]:55} {q.clicks:>3}кл "
                              f"{q.cost:>7.2f}р  [{q.matched_pattern}]")

        if report.b2b_queries:
            lines.append("\n--- B2B ЦЕЛЕВЫЕ (топ-15) ---")
            for q in report.b2b_queries[:15]:
                lines.append(f"  {q.query[:55]:55} {q.clicks:>3}кл "
                              f"{q.cost:>7.2f}р")

        if report.unknown_queries:
            lines.append("\n--- НЕКЛАССИФИЦИРОВАННЫЕ (топ-15, разбери вручную) ---")
            for q in sorted(report.unknown_queries,
                            key=lambda x: x.cost, reverse=True)[:15]:
                lines.append(f"  {q.query[:55]:55} {q.clicks:>3}кл "
                              f"{q.cost:>7.2f}р")

        if report.new_negatives_added:
            lines.append(f"\nНОВЫЕ МИНУС-СЛОВА ({len(report.new_negatives_added)}):")
            lines.append(f"  {', '.join(report.new_negatives_added)}")

        lines.append("")
        return "\n".join(lines)


# ─── CLI ────────────────────────────────────────────────────

def main():
    import argparse

    parser = argparse.ArgumentParser(description="Анализ поисковых запросов B2B")
    parser.add_argument("--days", type=int, default=7, help="Период анализа (дней)")
    parser.add_argument("--auto-add", action="store_true",
                        help="Автоматически добавить минус-слова")
    parser.add_argument("--campaigns", type=int, nargs="+",
                        default=B2B_CAMPAIGN_IDS,
                        help="ID кампаний")
    args = parser.parse_args()

    analyzer = QueryAnalyzer()
    report = analyzer.analyze(
        campaign_ids=args.campaigns,
        days=args.days,
        auto_add=args.auto_add,
    )

    print(analyzer.format_report_plain(report))

    if report.new_negatives_added and not args.auto_add:
        print("\nДля автоматического добавления запустите с --auto-add")


if __name__ == "__main__":
    main()
