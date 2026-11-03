"""Publish a bilingual copy of the game's changelog, including unlisted sections."""
import json
import re
from pathlib import Path

repo = Path(__file__).resolve().parents[1]
raw = json.loads((repo/'tools/game-release-log.json').read_text(encoding='utf-8'))
path = repo/'docs/updates.json'
config = json.loads(path.read_text(encoding='utf-8'))
translations = dict(line.split('|',1) for line in '''Content|Контент
Changes|Изменения
QoL|Удобство игры
Exclusive|Эксклюзивы
Codes|Коды из этого обновления
COMING SOON|В разработке
Season Pass|Сезонный пропуск
New Content|Новый контент
Endless Mode|Бесконечный режим
10M Event|Событие 10 миллионов
HALLOWEEN|Хэллоуин
Halloween Content|Контент Хэллоуина
Upgrade Tree|Дерево улучшений
Rework|Переработки
Reworks|Переработки
Game Release|Выход игры
UPDATE 1|Обновление 1
UPDATE 2|Обновление 2
Update 5|Обновление 5
Party Event|Праздничное событие
Big Update|Большое обновление
Pass + More|Сезонный пропуск и другое
Endless + More|Бесконечный режим и другое
10M Event + QoL|Событие 10 миллионов и улучшения
New Rarity + Content|Новая редкость и контент
HALLOWEEN + CONTENT|Хэллоуин и контент
Halloween Part 2 + More|Вторая часть Хэллоуина и другое
QoL + Content|Удобство игры и контент
New Units + Changes|Новые юниты и изменения
Trading Plaza + Fun Mode|Торговая площадь и развлекательный режим
9 Units|9 юнитов
3 Modes|3 режима
Group Rewards|Награды за группу
Matchmaking|Подбор матчей
Leaderboard|Таблица лидеров
2 New Units|2 новых юнита
Target|Выбор приоритета атаки
Quests|Задания
Keybinds|Горячие клавиши
Sounds|Звуки
Updated UI|Обновлённый интерфейс
Next Stats Unit|Просмотр характеристик следующего улучшения
Lobby Leaderstats|Статистика игроков в лобби
Player Info|Информация об игроке
Trade Setting|Настройки обменов
3 New Units|3 новых юнита
Scientist Crate|Ящик учёных
Insane Mode|Безумный режим
AFK AREA|АФК-зона
Rebalance|Перебалансировка
Crate Trading|Обмен ящиками
Tutorial|Обучение
Party Countdown|Отсчёт для группы
Bug Fix|Исправления ошибок
Piata Event|Событие с пиньятой
Party Crate|Праздничный ящик
Global Quests|Глобальные задания
Splash|Сплеш-атаки
Music Lobby|Музыка в лобби
More Sounds|Больше звуков
Golden Bat!|Золотая бита
New Rarity|Новая редкость
Insane Endless|Безумный бесконечный режим
New Lobby|Новое лобби
Boosts|Усиления
New Summon|Обновлённый призыв
Auto Sell|Автопродажа
Chat Trade|Торговый чат
Crazy Mode|Сумасшедший режим
5 New Toilets|5 новых туалетов
New Global Quests|Новые глобальные задания
Rework Matchmaking|Переработанный подбор матчей
Game Speed|Скорость игры
Wheel Spin|Колесо удачи
Tickets|Тикеты
Replay|Повтор матча
Boss Health Bar|Полоса здоровья босса
Search|Поиск
Packs|Наборы
VIP Pass|VIP-пропуск
50 Tiers|50 уровней
Premium Pass|Платный пропуск
Pass Quests|Задания пропуска
Skip Tier|Пропуск уровня
Ticket Tradeable|Обмен тикетами
Gamepass Gift|Подарки пропусков
Index|Индекс
Forever Pack|Бесконечный набор
Game Speed Keybind|Горячая клавиша скорости игры
Endless Leaderboard|Таблица лидеров бесконечного режима
Endless Rewards|Награды бесконечного режима
New Boost|Новое усиление
Trade History|История обменов
Multi Sell|Массовая продажа
Camera Man Rework|Переработка Камерамена
Unit Hitbox|Область размещения юнита
Unit Manager|Управление юнитами
Friend Boost|Бонус за друзей
Global Events|Глобальные события
New UI|Новый интерфейс
Loading Screen|Экран загрузки
A Lot Of Bug Fix|Множество исправлений ошибок
New Currency|Новая валюта
10M Crate|Ящик 10 миллионов
4 New Units|4 новых юнита
Limited Unit Event!|Событие с лимитным юнитом
Event Shop|Магазин события
Win-Streaks|Серии побед
Free Gifts|Бесплатные подарки
Lucky Blocks|Лаки-блоки
2x XP Boost|Усиление опыта x2
Items|Предметы
Season Pass 2|Второй сезонный пропуск
Game Settings|Настройки игры
AFK Rework|Переработанная АФК-зона
Mailbox|Почта
Rejoin Game|Возвращение в матч
New OMEGA Rarity|Новая редкость Омега
QoL Trading|Улучшения обменов
Gamepass Trading|Обмен пропусками
Crafting|Крафт
Spooky Crate|Хэллоуинский ящик
Halloween Pass|Хэллоуинский пропуск
Halloween Shop|Хэллоуинский магазин
Halloween Quests|Хэллоуинские задания
5 New Units|5 новых юнитов
Scary Mode|Хэллоуинский режим
Strider Crate|Ящик страйдеров
Ability Glitch Camera Man|Способность Глитч Камерамена
Spooky Gifts|Хэллоуинские подарки
Rework Quests|Переработанные задания
Halloween Pack|Хэллоуинский набор
Spooky Forever Pack|Хэллоуинский бесконечный набор
Likes Rewards|Награды за лайки
Active Boost|Бонусы за активность
Auto Ability|Автоматическое применение способностей
New Units Upgrades|Новые улучшения юнитов
Drag Delete|Удаление перетаскиванием
+1 VIP Pass Bonus|Дополнительный бонус VIP-пропуска
Terminal|Терминал
Clans|Кланы
Low Mode|Режим низкой графики
Flying Toilets|Летающие туалеты
New Units|Новые юниты
Plushie|Плюшевые аксессуары
Limited Pack|Лимитный набор
Spawn Animation|Анимация появления
New Balance|Новый баланс
Hyper Titan Speaker Man|Гипер Титан Спикермен
Lock Units|Блокировка юнитов
Interface Improvement|Улучшения интерфейса
Only Friends Trade|Обмены только с друзьями
Kick Party Player|Исключение игрока из группы
x10 Crate Open|Открытие 10 ящиков за раз
New Index|Новый индекс
Loadouts|Сохранённые наборы юнитов
5 New Sounds|5 новых звуков
Hyper Pack|Гипер-набор
Ranks!|Ранги
6 New Ranks|6 новых рангов
Trading Plaza|Торговая площадь
New 2 Units|2 новых юнита
RNG Mode|RNG-режим
New Player Information|Новая информация об игроках
UI Changes|Изменения интерфейса
Rework Streak|Переработка серий побед
Rework Maps|Переработка карт'''.splitlines())

def key(text):
    return ' '.join(re.sub(r'[^A-Za-z0-9+ /!?.=-]', '', text).split())

def localized(text, code=False):
    return {'en':text, 'ru':text if code else translations[key(text)]}

releases = []
for source_id, entry in raw.items():
    order = []
    for name in entry.get('SectionOrder',[]):
        if name == 'Rework' and name not in entry and 'Reworks' in entry:
            name = 'Reworks'
        if isinstance(entry.get(name),list) and name not in order:
            order.append(name)
    # Some official records omit Exclusive, QoL, Codes or COMING SOON from SectionOrder.
    order += [name for name,values in entry.items() if name != 'SectionOrder' and isinstance(values,list) and name not in order]
    sections = []
    for name in order:
        section = {'sourceKey':name, 'title':localized(name),
                   'items':[localized(item, name=='Codes') for item in entry[name]]}
        if name == 'COMING SOON':
            section['kind'] = 'planned'
        if name == 'Codes':
            section['kind'] = 'historic-codes'
        sections.append(section)
    releases.append({'id':source_id,'version':str(entry['Number']),'date':entry['ReleaseDate'],
                     'title':localized(entry['Title']),'sections':sections,'source':'in-game changelog'})
releases.sort(key=lambda r:r['date'],reverse=True)
previews = [r for r in config['releases'] if r.get('status') == 'upcoming']
config['releases'] = releases + previews
config['currentVersion'] = releases[0]['version']
config['currentTitle'] = releases[0]['title']
config['nextUpdate']['title'] = {'en':'The next Alliance TD update','ru':'Следующее обновление Alliance TD'}
path.write_text(json.dumps(config,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='\n')
print(f'Imported all {len(releases)} official releases and preserved {len(previews)} development preview.')
