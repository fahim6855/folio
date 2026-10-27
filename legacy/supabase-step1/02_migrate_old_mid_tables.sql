-- Folio · step 1 · copy the old mid tables into the new b32_s2_m1 table
-- Run AFTER 01_create_tables.sql, in the same Supabase project as the old tables.
--
-- Safe to run: it never changes or deletes the old tables, it skips any old table that doesn't exist,
-- it ignores duplicate class rolls, and it leaves a mark empty if the old value isn't a plain number
-- (for example text such as "AB"). Running it twice is harmless.
-- If the old tables live in a different Supabase project, export them as CSV instead and ignore this file.

do $$
declare
  code text;
  old_table text;
begin
  foreach code in array array['1201', '1202', '1203', '1204', '1205'] loop
    old_table := '32nd_2nd_mid1_' || code;
    if to_regclass(format('public.%I', old_table)) is null then
      raise notice 'Skipping %, table not found', old_table;
      continue;
    end if;
    execute format(
      'insert into public.b32_s2_m1 (class_roll, %1$I)
       select distinct on (trim(class_roll::text))
              trim(class_roll::text),
              case when trim(marks::text) ~ ''^[0-9]+(\.[0-9]+)?$'' then trim(marks::text)::numeric end
         from public.%2$I
        where trim(class_roll::text) <> ''''
        order by trim(class_roll::text)
       on conflict (class_roll) do update set %1$I = excluded.%1$I',
      'marks_' || code, old_table);
  end loop;
end $$;

-- Check: how many students now have a row.
select count(*) as rows_copied from public.b32_s2_m1;
