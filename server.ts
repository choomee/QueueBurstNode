import * as dotenv from 'dotenv';
import * as express from 'express';
import { Database } from './database'; 
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import * as moment from 'moment';

export class ServerApp {
  private app: express;
  private logger: winston.Logger;
  constructor() {
      dotenv.config();
      // console.log('constructor #1');
      // console.log('User :'+String(process.env.USER_NAME));
      // console.log('PASSWORD :'+String(process.env.PASSWORD));
      // console.log('CONNECTION_STRING :'+String(process.env.CONNECTION_STRING));
      const transport: DailyRotateFile  = new DailyRotateFile({
        filename: 'qbursting-%DATE%.log',
        datePattern: 'YYYY-MM-DD-HH',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        level: 'info',
        dirname: './logs',
        json: false,
      });
      const logFormat = winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.align(),
        winston.format.printf(
          info => moment(info.timestamp).utc().utcOffset("+0700").format() + '-' + info.level + '-message:'+info.message
        ),
      );
      
      transport.on('rotate', function(oldFilename, newFilename) {
        // do something fun
      });
      
      this.logger = winston.createLogger({
        format: logFormat,
        transports: [
          transport
        ]
      });

      this.app=express(); 
      // var server = this.app.listen(8000, '127.0.0.1', function () {  
      //   var host = server.address().address ;
      //   var port = server.address().port;
      //   // this.logger.info('APP listening at http://'+host+':'+port+'/get_item?item=800800' ) ;
      // });  
      

  }
  public start(): void{
      var server = this.app.listen(process.env.PORT, '127.0.0.1',  () => {  
        var host = server.address().address ;
        var port = server.address().port;
        this.logger.info('APP listening at http://'+host+':'+port+'/get_item?item=800800' ) ;
      });  
  }
  public async getItem(){
    this.app.get('/get_item', function (req, res) {  
        let data = new Database();
        data.getItem(req.query['item']).then( obj =>  res.send(obj));  
    })  
  }

  public async getCountItemUpdate(){
    this.app.get('/get_cntitem', function (req, res) {  
        let data = new Database();
        data.getCntItemUpdate().then( obj =>  res.send(obj));  
    })  
  }

  public async getListItem(){
    this.app.get('/get_listitem', function (req, res) {  
        let data = new Database();
        let start_ind: String | undefined;
        let volumn: String | undefined;

        start_ind = req.query['start_ind'];
        volumn = req.query['volumn'];
        if (start_ind == undefined ) {
          start_ind = "0";
        } 
        if (volumn == undefined ) {
          volumn = "0";
        } 
        // console.log("start_ind :"+start_ind);
        data.getListItem(Number(start_ind), Number(volumn)).then( obj =>  res.send(obj));  
    })   
  }

}

let serverApp = new ServerApp();
serverApp.start();
serverApp.getItem();
serverApp.getCountItemUpdate();
serverApp.getListItem();
