from fastapi import FastAPI
import requests
import json
from typing import Optional
from bs4 import BeautifulSoup
import re
import uvicorn

head = {
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36'
}
Appcode = '5a0098ba23634c1bb023c33da60f6648'

app = FastAPI()


def get_weather(lat, lon):
    url = 'http://apifreelat.market.alicloudapi.com/whapi/json/aliweather/briefforecast3days'
    form_data = {
        'lat': lat,
        'lon': lon
    }
    head = {
        'Authorization': 'APPCODE {}'.format(Appcode),
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
    res = requests.post(url, data=form_data, headers=head)
    data = json.loads(res.text)
    city_info = data.get('data').get('city')
    pname = city_info.get('pname')
    name = city_info.get('name')
    weather_info = '{}/{}\n'.format(pname, name)

    x = '{}:\n' \
        '白天:{}, {}°\n' \
        '夜间:{}, {}°\n'
    forecast = data.get('data').get('forecast')
    for item in forecast:
        conditionNight = item.get('conditionNight')
        predictDate = item.get('predictDate')
        conditionDay = item.get('conditionDay')
        tempDay = item.get('tempDay')
        tempNight = item.get('tempNight')
        weather_info += x.format(predictDate, conditionDay, tempDay, conditionNight, tempNight)
    return weather_info[:-1]

def get_movie(title):

    url = 'https://www.kdtv.cc/search.php?searchword=' + title
    res = requests.get(url, headers=head)
    soup = BeautifulSoup(res.text, 'lxml')
    ul = soup.find('ul', class_='stui-vodlist__media col-pd clearfix')
    result = re.findall('<a class="v-thumb stui-vodlist__thumb lazyload" data-original="(.*?)" href="(.*?)" title="(.*?)">', str(ul))
    try:
        result = [{'title': i[2], 'url': 'https://www.kdtv.cc/{}'.format(i[1]), 'pic': i[0]} for i in result]
    except:
        result = [{'title': '找不到该影片', 'url': '', 'pic': ''}]
    return result

@app.get('/weather')
def weather(lat: Optional[str] = None, lon: Optional[str] = None):
    if lat and lon:
        weather_info = get_weather(lat, lon)
        return {'weather_info': weather_info}
    return {'error': 'no city selected!'}


@app.get('/movie')
def movie(title: Optional[str] = None):
    if title:
        return get_movie(title)
    return []

if __name__ == '__main__':
    uvicorn.run(app, host='127.0.0.1', port=5000)