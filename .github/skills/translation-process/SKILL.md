---
name: translation-process
description: Use when updating MapleStory skill names, translations, or icons in data/classesData.json from mxd.dvg.cn.
---

# Translation Process

Use this process when the user requests MapleStory skill-data updates. The user supplies the classes and skill entries, and may provide known skill IDs.

## Sources and language regions

- Use https://mxd.dvg.cn/skill_list.php to verify skills.
- Use GMS records for English skill names and image sources, CMS records for Simplified Chinese (`ch_s`), and TMS records for Traditional Chinese (`ch_t`).
- Search by name with the region specified, for example:
  `https://mxd.dvg.cn/skill_list.php?q=[URL-ENCODED NAME]&region=gms`
- Verify the exact skill ID and GMS record for the intended class and skill context. If multiple records match, do not guess.
- If the user supplies an ID, verify that it matches the intended skill and class.
- Use each confirmed ID to find the corresponding CMS and TMS records. Do not invent, machine-translate, or infer missing translations. Report any unconfirmed localization as unresolved and ask for clarification.
- The site API returns matching skills across jobs and may return several records with the same skill name for one class (e.g. level variants). Filter by the intended class/job, use the shared ID for CMS/TMS, and prefer the canonical non-empty icon record; never infer an ID solely from a matching name.

## Combined skill entries

- In `mastery` and `boost` entries, `/` usually separates individual skill components, except for slashes inside bracketed qualifiers such as `[M/E]`. Look up every component separately; do not search for the combined display string as one skill.
- Preserve component order and return one translation per component, joined with ` / ` in both `ch_s` and `ch_t`.
- For a mastery component, search its HEXA record first. If no matching HEXA record exists but a corresponding Boost record does, use that verified Boost record for the component's CMS/TMS translations; do not substitute a regular skill record.
- Boost records may be listed under different job groups (including `40000` and `50000`). Search by the exact Boost title and confirm the record's class/skill context and icon path instead of assuming one job ID.
- Include bracketed components in verification. Search the literal component first; brackets may be removed from the search term as a fallback, but the component must not be omitted.
- Keep the existing combined English display name and component order unless the user specifically requests a verified English-name correction.
- Example:
  - English: `Impale / Resonance Rush / Noble Summons / Aether Bloom`
  - `ch_s`: `御剑穿刺 / 共振 / 御剑收鞘 / 盛放之剑`
  - `ch_t`: `穿刺 / 魔劍共鳴 / 回歸 / 綻放`

## Icon lookup and storage

- Each JSON entry has one icon. For a combined mastery or boost entry, use the first component's icon.
- For mastery entries, find the first component's HEXA skill (search `HEXA [skill name]`, unless the component already includes `HEXA`). If no matching HEXA record exists but a corresponding Boost record does, use that Boost record as the icon source; do not use the regular skill record.
- For boost entries, find the first component's boost skill (search `[skill name] boost`). Do not use the regular skill record.
- Confirm the icon belongs to the correct class and skill record. Use only the icon path from that verified GMS result.
- Download the image from `https://mxd.dvg.cn` plus the verified GMS icon path. Verify that the downloaded file is non-empty and is a valid image.
- Use a lowercase, hyphen-separated filename based on the verified skill name.
- Save class-specific icons under `src/icon/[faction]/[normalized-class-name]/`. The app normalizes class names by lowercasing and removing non-alphanumeric characters; for example, `Arch Mage (Fire, Poison)` maps to `archmagefirepoison`.
- Save shared/common-skill icons under `src/icon/common/` and use `../../common/[filename]` as the JSON icon path. Use only the filename for class-specific icons.
- If the correct icon cannot be verified or downloaded, leave `icon` blank and report why.

## Editing rules

- Edit the existing entry in `data/classesData.json`; do not add duplicates.
- Preserve JSON structure and formatting, class order, section order, and each entry's existing section (`skill`, `mastery`, `boost`, or `common`).
- Preserve existing `t` values such as `origin`, `ascent`, or `third`.
- Keep combined English names unless the user requests a verified correction. Update translations and icons as requested.
- Do not modify unrelated entries or files.
- Ignore the third HEXA skill when its translation or icon is expected to be unavailable, unless the user explicitly includes it.

## Validation and report

- Confirm `data/classesData.json` parses as valid JSON.
- Check that all nonblank icon paths point to existing files and that newly downloaded icons are referenced correctly.
- Run `git diff --check`.
- Report updates grouped by class. For each updated combined entry, include:
  - The English entry as stored in the JSON.
  - Each skill component and its verified ID.
  - The assembled CMS and TMS translations.
  - The icon's source skill and ID, and the saved file path.
- List unresolved skills, translations, or icons separately and specify what information is needed. Do not claim unchecked entries were verified.
