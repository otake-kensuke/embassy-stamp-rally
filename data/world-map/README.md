# World Map production data

v0.8 World Mapが遅延読込する表示専用データです。

- `embassy-country-mapping-v0.8.json`: 正式157件とNatural Earthの検証済み対応表
- `ne_110m_admin_0_countries.geojson`: Natural Earth Vector v5.1.2
- `NATURAL-EARTH-LICENSE.md`: Natural Earth terms

MappingのPrimary Sourceは`js/data.js`です。World MapはMappingと現在の`embassies[id].status`から表示を毎回導出し、専用状態を保存しません。

Mappingの生成・検証元:

- `prototype/world-map-concept/tools/build-country-mapping.js`
- `prototype/world-map-concept/COUNTRY-MAPPING-VALIDATION.md`
- `prototype/world-map-concept/COUNTRY-MAPPING-EXCEPTIONS.md`

Natural Earth source: https://github.com/nvkelso/natural-earth-vector/tree/v5.1.2

Natural Earth data is public domain.
