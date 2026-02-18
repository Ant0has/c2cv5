"""
Add text overlays to RSYa banner images for B2B campaign.
Adds semi-transparent dark strip with white text to filter non-B2B clicks.
"""
from PIL import Image, ImageDraw, ImageFont
import os

# Fonts
FONT_BOLD = "C:\\Windows\\Fonts\\arialbd.ttf"
FONT_REGULAR = "C:\\Windows\\Fonts\\arial.ttf"

# Base paths
INPUT_BASE = r"c:\ProjectAI\Yandex_bidder\city2city_РСЯ_креативы\city2city_rsa_creatives"
OUTPUT_BASE = r"c:\ProjectAI\Yandex_bidder\city2city_РСЯ_креативы_с_текстом"
os.makedirs(OUTPUT_BASE, exist_ok=True)

# Series config: (folder, filename_pattern, main_text, sub_text, output_prefix)
SERIES = [
    {
        "name": "Серия 1 — Корпоративный",
        "folder": "СЕРИЯ 1 «Гарантия подачи»",
        "files": {
            "wide": "1.3 Водитель ждёт у офиса_1920x1080.png",
            "square": "1.3 Водитель ждёт у офиса_1080x1080.png",
        },
        "main_text": "КОРПОРАТИВНЫЙ ТРАНСФЕР",
        "sub_text": "Оплата по счёту  •  Договор  •  НДС",
        "prefix": "corp",
    },
    {
        "name": "Серия 2 — Документы",
        "folder": "СЕРИЯ 2«Документы для бухгалтерии»",
        "files": {
            "wide": "2.1 Чек с QR-кодом 1920x1080.png",
            "square": "2.1 Чек с QR-кодом 1080x1080.png",
        },
        "main_text": "ЗАКРЫВАЮЩИЕ ДОКУМЕНТЫ",
        "sub_text": "Счёт  •  Акт  •  Договор для бизнеса",
        "prefix": "doc",
    },
    {
        "name": "Серия 4 — Офис-менеджер",
        "folder": "СЕРИЯ 4 «Персонажи _ роли»",
        "files": {
            "wide": "4.1 Офис-менеджер бронирует трансфер 1920x1080.png",
            "square": "4.1 Офис-менеджер бронирует трансфер 1080x1080.png",
        },
        "main_text": "ТРАНСФЕР ДЛЯ БИЗНЕСА",
        "sub_text": "Договор  •  Постоплата  •  Отчётность",
        "prefix": "contract",
    },
]


def add_text_overlay(img_path, output_path, main_text, sub_text, brand="city2city.ru"):
    """Add text overlay with semi-transparent strip to bottom of image."""
    img = Image.open(img_path).convert("RGBA")
    w, h = img.size

    # Create overlay layer
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # Font sizes based on image width
    if w >= 1920:  # wide
        main_size = 62
        sub_size = 34
        brand_size = 28
        strip_height = int(h * 0.30)
        padding_bottom = 30
        line_gap = 16
    elif w >= 1440:  # medium
        main_size = 52
        sub_size = 28
        brand_size = 24
        strip_height = int(h * 0.30)
        padding_bottom = 25
        line_gap = 14
    else:  # square 1080x1080
        main_size = 52
        sub_size = 28
        brand_size = 22
        strip_height = int(h * 0.28)
        padding_bottom = 25
        line_gap = 14

    font_main = ImageFont.truetype(FONT_BOLD, main_size)
    font_sub = ImageFont.truetype(FONT_REGULAR, sub_size)
    font_brand = ImageFont.truetype(FONT_BOLD, brand_size)

    # Draw semi-transparent dark strip at bottom
    strip_top = h - strip_height
    draw.rectangle(
        [(0, strip_top), (w, h)],
        fill=(0, 0, 0, 160)  # Black with ~63% opacity
    )

    # Optional: gradient fade at top of strip for softer transition
    gradient_height = 40
    for i in range(gradient_height):
        alpha = int(160 * (i / gradient_height))
        y = strip_top - gradient_height + i
        if y >= 0:
            draw.rectangle([(0, y), (w, y + 1)], fill=(0, 0, 0, alpha))

    # Calculate text positions (centered horizontally, stacked from bottom up)
    # Brand text (bottom)
    brand_bbox = draw.textbbox((0, 0), brand, font=font_brand)
    brand_w = brand_bbox[2] - brand_bbox[0]
    brand_h = brand_bbox[3] - brand_bbox[1]
    brand_x = (w - brand_w) // 2
    brand_y = h - padding_bottom - brand_h

    # Sub text (above brand)
    sub_bbox = draw.textbbox((0, 0), sub_text, font=font_sub)
    sub_w = sub_bbox[2] - sub_bbox[0]
    sub_h = sub_bbox[3] - sub_bbox[1]
    sub_x = (w - sub_w) // 2
    sub_y = brand_y - line_gap - sub_h

    # Main text (above sub)
    main_bbox = draw.textbbox((0, 0), main_text, font=font_main)
    main_w = main_bbox[2] - main_bbox[0]
    main_h = main_bbox[3] - main_bbox[1]
    main_x = (w - main_w) // 2
    main_y = sub_y - line_gap * 1.5 - main_h

    # Draw texts with slight shadow for readability
    shadow_offset = 2

    # Main text
    draw.text((main_x + shadow_offset, main_y + shadow_offset), main_text,
              font=font_main, fill=(0, 0, 0, 120))
    draw.text((main_x, main_y), main_text, font=font_main, fill=(255, 255, 255, 255))

    # Sub text
    draw.text((sub_x + shadow_offset, sub_y + shadow_offset), sub_text,
              font=font_sub, fill=(0, 0, 0, 120))
    draw.text((sub_x, sub_y), sub_text, font=font_sub, fill=(220, 220, 220, 255))

    # Brand
    draw.text((brand_x + shadow_offset, brand_y + shadow_offset), brand,
              font=font_brand, fill=(0, 0, 0, 120))
    draw.text((brand_x, brand_y), brand, font=font_brand, fill=(180, 210, 255, 230))

    # Thin accent line between main and sub text
    line_y = int(sub_y - line_gap * 0.75)
    line_margin = w // 4
    draw.rectangle(
        [(line_margin, line_y), (w - line_margin, line_y + 2)],
        fill=(180, 210, 255, 100)
    )

    # Composite
    result = Image.alpha_composite(img, overlay)
    # Convert to RGB for PNG without alpha (smaller file, Yandex compatibility)
    result_rgb = result.convert("RGB")
    result_rgb.save(output_path, "PNG", quality=95)
    print(f"  Saved: {output_path} ({w}x{h})")


def main():
    total = 0
    for series in SERIES:
        print(f"\n=== {series['name']} ===")
        folder = os.path.join(INPUT_BASE, series["folder"])

        for size_key, filename in series["files"].items():
            input_path = os.path.join(folder, filename)
            if not os.path.exists(input_path):
                print(f"  SKIP (not found): {input_path}")
                continue

            output_name = f"{series['prefix']}_{size_key}_text.png"
            output_path = os.path.join(OUTPUT_BASE, output_name)

            add_text_overlay(
                input_path, output_path,
                series["main_text"], series["sub_text"]
            )
            total += 1

    print(f"\n{'='*50}")
    print(f"Total images created: {total}")
    print(f"Output folder: {OUTPUT_BASE}")


if __name__ == "__main__":
    main()
