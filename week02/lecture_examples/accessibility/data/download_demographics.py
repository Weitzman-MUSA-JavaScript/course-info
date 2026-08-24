import csv
import click
import requests


@click.command()
@click.argument(
    'output',
    type=click.File('w')
)
@click.option(
    '--geog',
    type=click.Choice(['block', 'block group'], case_sensitive=False),
    default='block',
    show_default=True
)
def main(output, geog):
    geog = geog.replace(' ', '+')
    url = (
        'https://api.census.gov/data/2020/dec/dhc'
        '?get=P10_001N,P10_002N,P10_003N,P10_004N,P10_005N,P10_006N,P10_007N,P10_008N,P10_009N'
        f'&for={geog}:*&in=state:42+county:101'
    )

    resp = requests.get(url)
    data = resp.json()

    writer = csv.writer(output)
    writer.writerows(data)


if __name__ == '__main__':
    main()
