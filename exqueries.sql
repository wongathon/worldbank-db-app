-- check syntax
select distinct i.id, i.name, i.code from indicator i, indicator_value iv
where i.id = iv.indicator_id and iv.value > "some number"

-- check
select i.id, i.name, i.code, sum(iv.value) from indicator i, indicator_value iv
where i.id = iv.indicator_id and iv.year >= 1960 and iv.year < 1970 
group by i.id, i.name, i.code 