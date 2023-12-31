   ////////////////////////////////////////////
  //////// Database Connection Tool //////////
 ////////////// Version 1.0.5 ///////////////
////////////////////////////////////////////

/*obs: usar somente no electron ou backend*/
class Conection{
    
    config(obj){
      
      this.db   = null;
      this.connection = null;
      this.base = obj.dataBase || obj.database;
      this.host = obj.host;
      this.port = obj.port;
      this.root = obj.root || obj.user;
      this.pass = obj.password;
      this.type = obj.typeDataBase || obj.type;

      if (typeof obj.file != "undefined") {

        const fs = require('fs');
        this.file = obj.file;

        try {

          const data = fs.readFileSync(this.file, 'utf8');        
          const jsonContent = JSON.parse(data);
          
          const objJSON = JSON.parse(data);
          this.base = objJSON.dataBase || objJSON.database;
          this.host = objJSON.host;
          this.port = objJSON.port;
          this.root = objJSON.root || objJSON.user;
          this.pass = objJSON.password;
          this.type = objJSON.typeDataBase || objJSON.type;

        } catch (error) {
          console.error('Erro ao ler ou fazer o parse do arquivo JSON:', error);
        }
      }

      if(this.type.toLowerCase() == 'sqlite'){
        if(this.base.lastIndexOf('.db') == -1) this.base += '.db';
        const sqlite3 = require('sqlite3').verbose();
        return new Promise((resolve, reject) => {
          try {
            this.db = new sqlite3.Database(this.base, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
            console.log('Created Database! / Successfully connected!')
            resolve(true); // Resolve a promessa com o valor true quando a conexão é estabelecida
          } catch (err) {
              reject(err); // Rejeita a promessa em caso de erro
              return;
          }
        });
      }
      if(this.type.toLowerCase() == 'mysql'){
        const mysql = require('mysql');

        //cria conexao
        this.connection = mysql.createConnection({
          host: this.host,
          user: this.root,
          password: this.password,
          database: this.base
        });

        return new Promise((resolve, reject) => {
          this.connection.connect(function(err) {
            if (err) {
              console.error('Erro: ', err);
              reject(err);
              return;
            }
            console.log('Successfully connected!')
            resolve(true);
          });
        });
      }      
      if(this.type.toLowerCase() == 'postgresql' || this.type.toLowerCase() == 'postgre'){
        const Pool = require('pg').Pool;
        this.connection = new Pool({
            host: this.host,
            port: this.port,
            password: this.pass,
            user: this.root,
            database: this.base
        });

        return new Promise((resolve, reject) => {          
          this.connection.connect((err, client, release) => {
            if (err) {
              console.error('Erro:', err);
              reject(err);
              return;
            } else {
              console.log('Successfully connected!');
              release(); // Libera a conexão de volta para o pool
              resolve(true);
            }
          })
        });
      }
    }
    run(sql){ 
      if(this.type.toLowerCase() == 'sqlite'){
        return new Promise((resolve, reject) => {
          this.db.all(sql, function(err, rows) {
            if(err) {
              console.error(err);
              reject(err);
            } else {
              //console.log(rows);
              resolve(rows);
            }
          });
        });
      }
      if(this.type.toLowerCase() == 'mysql'){        
        return new Promise((resolve, reject) => {
          this.connection.query(sql, function(err, result) {
            if (err) {
              console.error('Erro: ', err);
              reject(err); 
              return;
            }
            console.log('Inserted successfully!');
            resolve(result);
          });     
        });
      }
      if(this.type.toLowerCase() == 'postgresql' || this.type.toLowerCase() == 'postgre'){ 
        return new Promise((resolve, reject) => {
          this.connection.query(sql,(err,result)=>{
            if(err) {
              reject(err)
            } else {
              resolve(result.rows)
              //console.log(result.rows);
            }              
          })     
        });
      }
    }
    close(){
      if(this.type.toLowerCase() == 'sqlite'){
        this.db.close();
        return true;
      } 
      if(this.type.toLowerCase() == 'mysql'){
        this.connection.end(function(err) {
          if (err) {
            console.error('Connection terminated erro:', err);
            return false;
          }
          console.log('Connection terminated!');
          return true;
        });
      }
      if(this.type.toLowerCase() == 'postgresql' || this.type.toLowerCase() == 'postgre'){
        this.connection.end((err) => {
          if (err) {
            console.error('Erro:', err);
            return false;
          } else {
            console.log('Connection terminated!');
            return true;
          }
        })
      }
    }
}
module.exports = Conection;
