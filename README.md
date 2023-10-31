# Objetivo do Módulo / Module Objective
Este modulo é para uma conexão simples e com poucas linhas de código.   
This module is for a simple connection with few lines of code.

## Exemplo / Example

let conexao = require('database-connection-tool');

let con = new conexao();
con.config({
    
    dataBase:"myDB",
    type:"SQLite"
    
}).then(result => {
    //console.log(result);
}).catch(error => {
    console.error(error);
});

con.run("CREATE TABLE IF NOT EXISTS users(name varchar(50));");

## Mysql

let con = new conexao();
con.config({
    
    dataBase:'myDB',
    type:'MySQL',
    host:'localhost',
    password:'',
    root:'root'

}).then(result => {
    console.log(result);
}).catch(error => {
    console.error(error);
});

## PostgreSQL

let con = new conexao();
con.config({
    
    host:'localhost',
    port:'5432',
    password:'123',
    user:'postgres',
    database:'myDB',
    type:'postgre'

}).then(result => {
    console.log(result);
}).catch(error => {
    console.error(error);
});

## Arquivo Externo / External Archive

let con = new conexao();

con.config({file:'./config.json'})
.then(result => {
    console.log(result);
})
.catch(error => {
    console.error(error);
});

# Arquivo config.json / Archive config.json
{
    "dataBase":"myDB",
    "type":"SQLite"
}