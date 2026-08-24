* Go to https://data.census.gov/ to look up the fields needed (population by race)
  - Also, https://www.census.gov/data/developers/data-sets.html
  - For the 2020 Decennial Census, this is helpful: https://api.census.gov/data/2020/dec/dhc/variables.html
  - In particular, we'll use:
    | Variable | Description |
    |----------|-------------|
    | P10_001N | total population 18+ |
    | P10_002N | one race |
    | P10_003N | white alone |
    | P10_004N | Black or African American alone |
    | P10_005N | American Indian and Alaska Native alone |
    | P10_006N | Asian alone |
    | P10_007N | Native Hawaiian and Other Pacific Islander alone |
    | P10_008N | Some Other Race alone |
    | P10_009N | Population of two or more races |
  - Download the block groups for Philadelphia. Could be from Census tiger line https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.2020.html
  - Use R or Python or QGIS to filter down to Philadelphia block groups and convert to GeoJSON
  - https://api.census.gov/data/2020/dec/dhc?get=NAME,P10_001N,P10_002N,P10_003N,P10_004N,P10_005N,P10_006N,P10_007N,P10_008N,P10_009N&for=block:*&in=state:42+county:101
