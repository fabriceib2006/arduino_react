CREATE TABLE 'videos'{
    'id' INTEGER PRIMARY KEY AUTOINCREMENT,
    'title' TEXT NOT NULL,
    'timedate' date NOT NULL,
}
CREATE TABLE 'commands'{
    'id' INTEGER PRIMARY KEY AUTOINCREMENT,
    'cmdtype' VARCHAR(200) NOT NULL,
    'tmsent' date NOT NULL,
}