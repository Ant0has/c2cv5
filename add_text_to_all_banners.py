"""
Add text overlays to ALL RSYa banner images for B2B campaign.
Processes all 6 series, all images, all 3 sizes.
"""
from PIL import Image, ImageDraw, ImageFont
import os
import glob

# Fonts
FONT_BOLD = "C:\\Windows\\Fonts\\arialbd.ttf"
FONT_REGULAR = "C:\\Windows\\Fonts\\arial.ttf"

# Base paths
INPUT_BASE = r"c:\ProjectAI\Yandex_bidder\city2city_РСЯ_креативы\city2city_rsa_creatives"
OUTPUT_BASE = r"c:\ProjectAI\Yandex_bidder\city2city_РСЯ_креативы_с_текстом"
os.makedirs(OUTPUT_BASE, exist_ok=True)

# Text config per series
SERIES_TEXT = {
    "СЕРИЯ 1": {
        "main_text": "КОРПОРАТИВНЫЙ ТРАНСФЕР",
        "sub_text": "Гарантия подачи  •  Водитель ждёт  •  Договор",
    },
    "СЕРИЯ 2": {
        "main_text": "ЗАКРЫВАЮЩИЕ ДОКУМЕНТЫ",
        "sub_text": "Счёт  •  Акт  •  УПД  •  Договор для бизнеса",
    },
    "СЕРИЯ 3": {
        "main_text": "ФИКСИРОВАННАЯ ЦЕНА",
        "sub_text": "Без скрытых платежей  •  Оплата по счёту",
    },
    "СЕРИЯ 4": {
        "main_text": "ТРАНСФЕР ДЛЯ БИЗНЕСА",
        "sub_text": "Договор  •  Постоплата  •  Отчётность",
    },
    "СЕРИЯ 5": {
        "main_text": "ПО ВСЕЙ РОССИИ",
        "sub_text": "Межгород для бизнеса  •  Оплата по счёту",
    },
    "СЕРИЯ 6": {
        "main_text": "КОРПОРАТИВНЫЙ ТРАНСФЕР",
        "sub_text": "Оплата по счёту  •  НДС  •  Договор",
    },
}


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
        fill=(0, 0, 0, 160)
    )

    # Gradient fade at top of strip
    gradient_height = 40
    for i in range(gradient_height):
        alpha = int(160 * (i / gradient_height))
        y = strip_top - gradient_height + i
        if y >= 0:
            draw.rectangle([(0, y), (w, y + 1)], fill=(0, 0, 0, alpha))

    # Calculate text positions (centered horizontally, stacked from bottom up)
    brand_bbox = draw.textbbox((0, 0), brand, font=font_brand)
    brand_w = brand_bbox[2] - brand_bbox[0]
    brand_h = brand_bbox[3] - brand_bbox[1]
    brand_x = (w - brand_w) // 2
    brand_y = h - padding_bottom - brand_h

    sub_bbox = draw.textbbox((0, 0), sub_text, font=font_sub)
    sub_w = sub_bbox[2] - sub_bbox[0]
    sub_h = sub_bbox[3] - sub_bbox[1]
    sub_x = (w - sub_w) // 2
    sub_y = brand_y - line_gap - sub_h

    main_bbox = draw.textbbox((0, 0), main_text, font=font_main)
    main_w = main_bbox[2] - main_bbox[0]
    main_h = main_bbox[3] - main_bbox[1]
    main_x = (w - main_w) // 2
    main_y = sub_y - int(line_gap * 1.5) - main_h

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

    # Thin accent line
    line_y = int(sub_y - line_gap * 0.75)
    line_margin = w // 4
    draw.rectangle(
        [(line_margin, line_y), (w - line_margin, line_y + 2)],
        fill=(180, 210, 255, 100)
    )

    # Composite and save
    result = Image.alpha_composite(img, overlay)
    result_rgb = result.convert("RGB")
    result_rgb.save(output_path, "PNG", quality=95)
    return True


def main():
    total = 0
    skipped = 0

    # Walk through all series folders
    for series_folder in sorted(os.listdir(INPUT_BASE)):
        folder_path = os.path.join(INPUT_BASE, series_folder)
        if not os.path.isdir(folder_path):
            continue

        # Match series to text config
        series_key = None
        for key in SERIES_TEXT:
            if key in series_folder:
                series_key = key
                break

        if not series_key:
            print(f"SKIP folder (no text config): {series_folder}")
            continue

        config = SERIES_TEXT[series_key]
        print(f"\n=== {series_folder} ===")
        print(f"    Text: {config['main_text']} / {config['sub_text']}")

        # Create subfolder in output
        out_folder = os.path.join(OUTPUT_BASE, series_folder)
        os.makedirs(out_folder, exist_ok=True)

        # Process all PNG files in this folder
        for filename in sorted(os.listdir(folder_path)):
            if not filename.lower().endswith('.png'):
                continue
            if filename.startswith('.'):
                continue

            input_path = os.path.join(folder_path, filename)
            output_path = os.path.join(out_folder, filename)

            try:
                success = add_text_overlay(
                    input_path, output_path,
                    config["main_text"], config["sub_text"]
                )
                if success:
                    img = Image.open(input_path)
                    w, h = img.size
                    print(f"  OK: {filename} ({w}x{h})")
                    total += 1
            except Exception as e:
                print(f"  ERROR: {filename}: {e}")
                skipped += 1

    print(f"\n{'='*60}")
    print(f"Total processed: {total}")
    print(f"Skipped/errors: {skipped}")
    print(f"Output: {OUTPUT_BASE}")


if __name__ == "__main__":
    main()
