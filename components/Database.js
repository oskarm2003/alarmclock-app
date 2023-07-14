import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase("Marciniak_Oskar_4i1b.db")

const translate_days = (days) => {

    let output = ''

    for (let day of days) {
        output += day + ','
    }

    return output.substring(0, output.length - 1)

}

class Database {

    static createTable() {
        console.log('create db if not exists');
        db.transaction(tx => {
            tx.executeSql("CREATE TABLE IF NOT EXISTS table1 (id integer primary key not null, hours text, minutes text, days text);");
        });
    }

    static add(hours, minutes) {
        console.log('add new alarms');
        db.transaction(tx => {
            tx.executeSql(`INSERT INTO table1 (hours, minutes, days) values ('${hours}', '${minutes}', 'null')`);
        });
    }

    static getAll() {
        console.log('rows request');
        var query = "SELECT * FROM table1";
        return new Promise((resolve, reject) => db.transaction((tx) => {
            tx.executeSql(query, [], (tx, results) => {
                resolve(JSON.stringify(results));
            }, function (tx, error) {
                reject(error);
            });
        }))
    }

    static getOne(id) {
        console.log('one row request');
        var query = `SELECT * FROM table1 WHERE id='${id}'`;
        return new Promise((resolve, reject) => db.transaction((tx) => {
            tx.executeSql(query, [], (tx, results) => {
                resolve(JSON.stringify(results));
            }, function (tx, error) {
                reject(error);
            });
        }))
    }

    static delete(id) {
        console.log('delete from db');
        db.transaction(tx => {
            tx.executeSql(`DELETE FROM table1 WHERE (id=${id})`)
        })
    }

    static setDays(days, id) {
        console.log('update days');
        days = translate_days(days)

        console.log(days, id);

        db.transaction(tx => {
            tx.executeSql(`UPDATE table1 SET days='${days}' WHERE id=${id}`)
        })

    }
}

export default Database