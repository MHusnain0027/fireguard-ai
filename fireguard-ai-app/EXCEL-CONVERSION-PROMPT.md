# Reusable FACP Excel Conversion Prompt

Use this prompt with ChatGPT or another AI agent together with your source file
or pasted location data.

```text
Convert the attached FACP location data into one clean Excel `.xlsx` file that
is ready for upload through my FireGuard Admin Panel.

The Supabase table is `public.locations` and its required text columns are:

1. SNO
2. District_Code
3. District_Name
4. Code
5. Door_Name
6. Zone

Strict requirements:
- Create exactly one worksheet named `locations`.
- Use exactly these headers in row 1 and in the same order:
  SNO, District_Code, District_Name, Code, Door_Name, Zone
- Treat every column as text. Preserve leading zeros, hyphens, dots, ampersands,
  room codes, basement codes and capitalization from the source.
- Put one physical FACP location per row.
- Remove completely blank rows and exact duplicate location rows.
- Consider a location duplicate when District_Code, District_Name, Code,
  Door_Name and Zone are all the same after trimming spaces and ignoring case.
- Renumber SNO sequentially from 1 after cleaning the data.
- Do not create merged cells, formulas, colors, additional headings, notes,
  hidden sheets or extra columns.
- Do not invent missing values. If any required field is missing or ambiguous,
  list the affected source rows and ask me for clarification before producing
  the final file.
- Validate that no required cell is empty.
- Before delivering the file, report the source row count, final row count,
  duplicates removed and any rows requiring clarification.
- Deliver the completed `.xlsx` file as a downloadable file.

Example output row:
1 | 5400 | Opportunity basement | 5400-B1-177 | Pava Room | Zone 2

Important: The FireGuard upload is append-only. Existing Supabase data must not
be deleted. The Admin Panel will add only new locations and skip exact existing
duplicates.
```
