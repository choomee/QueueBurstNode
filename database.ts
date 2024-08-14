import * as oracledb from 'oracledb';
import * as dotenv from 'dotenv';

export class Database {
    constructor() {
        dotenv.config();
        // console.log('constructor #1');
        // console.log('User :'+String(process.env.USER_NAME));
        // console.log('PASSWORD :'+String(process.env.PASSWORD));
        // console.log('CONNECTION_STRING :'+String(process.env.CONNECTION_STRING));
        

    }
    public async connect(){
        // console.log('connect #1');
        try {
            await oracledb.createPool({
                user: String(process.env.USER_NAME) || 'SMART_QA_PROJECT_D',
                password: String(process.env.PASSWORD) || 'Quadel#23',  // myhrpw contains the hr schema password
                connectString: String(process.env.CONNECTION_STRING) || 'sml-np-scan:1521/MOMUAT',
                poolMin: 2,
                poolMax: 30,
                poolIncrement: 2

            });
            // this.connection = await oracledb.getConnection();
            // const result = await this.connection.execute( 'SELECT * FROM ITEM_MASTER WHERE ITEM=950950');
            // console.log('result: ',result);
        } catch ( error ){
             console.log('Error: ', error);
        }
        // console.log('connect #2');
    }

    public async getItem(item: string){
        let connection: any;
        let Item_Master: Object;
        let Item: Object

        await this.connect();
        
        connection = await oracledb.getConnection();
        // const result = await connection.execute( 'SELECT * FROM ITEM_MASTER WHERE ITEM='+item);
        // let sql = "SELECT * FROM ( SELECT ITEM_PARENT, item as BARCODE, item_desc, to_char( last_update_datetime, \
        //     'DD-MM-YYYY hh24:mi:ss') update_datetime from ITEM_MASTER WHERE PRIMARY_REF_ITEM_IND = 'Y' \
        //     AND ITEM_PARENT IN ( SELECT ITEM FROM ITEM_MASTER im )) WHERE ITEM_PARENT='"+item+"' OR BARCODE='"+item+"'";
        let sql = "SELECT qim.ITEM , qb.BARCODE , qim.ITEM_DESC , qim.LAST_UPDATE_DATETIME  FROM rms.QB_ITEM_MASTER qim , rms.QB_BARCODE qb \
        WHERE qim.ITEM =qb.ITEM(+)  \
        AND ( qim.item='"+item+"' OR qb.barcode = '"+item+"')";
        // console.log ('SQL :'+sql);
        const result = await connection.execute( sql);
        // console.log("Result :"+JSON.stringify(result));
        await connection.close();
        Item_Master = new Object();
        Item = new Object();
        if ( result.rows[0] != null){
            Item_Master['ITEM_NO'] = result.rows[0][0];
            Item_Master['BARCODE'] = result.rows[0][1];
            Item_Master['ITEM_DESC'] = result.rows[0][2];
            Item_Master['UPDATE_DATETIME'] = result.rows[0][3];
            Item['ITEM_MASTER'] = Item_Master;
        } 
        return Item;
    }

    public async getCntItemUpdate(){
        let connection: any;
        let Item_Update: Object;

        await this.connect();
        
        connection = await oracledb.getConnection();

        let sql = "SELECT count(*) , max(( CASE WHEN qb.LAST_UPDATE_DATETIME > qim.LAST_UPDATE_DATETIME \
            THEN qb.LAST_UPDATE_DATETIME ELSE qim.LAST_UPDATE_DATETIME END)) LAST_UPDATE  \
            FROM rms.QB_ITEM_MASTER qim , rms.QB_BARCODE qb \
            WHERE qim.ITEM =qb.ITEM";
        // console.log ('SQL :'+sql);
        const result = await connection.execute( sql);
        // console.log("Result :"+JSON.stringify(result));
        await connection.close();
        Item_Update = new Object();

        if ( result.rows[0] != null){
            Item_Update['CNT'] = result.rows[0][0];
            Item_Update['LAST_UPDATE'] = result.rows[0][1];
        } 
        return Item_Update;
    }

    public async getListItem(start_ind: number, volumn: number){
        type MyType = {
            item_no: string;
            barcode: string;
            item_desc: string;
            update_datetime: Date;
            row_n: number;
        }
        let connection: any;
        let Item_Master: Object;
        let Item: MyType[] = [];
        let row_resturn: number;


        await this.connect();
        
        connection = await oracledb.getConnection();

        row_resturn = start_ind + volumn - 1;
        
        let sql = "SELECT * FROM ( \
            SELECT qim.ITEM , qb.BARCODE , qim.ITEM_DESC , \
            ( CASE WHEN qb.LAST_UPDATE_DATETIME > qim.LAST_UPDATE_DATETIME THEN qb.LAST_UPDATE_DATETIME ELSE qim.LAST_UPDATE_DATETIME END) AS UPDATE_DATE, \
            rownum row_n \
            FROM rms.QB_ITEM_MASTER qim , rms.QB_BARCODE qb  \
            WHERE qim.ITEM =qb.ITEM  \
            ORDER BY ( CASE WHEN qb.LAST_UPDATE_DATETIME > qim.LAST_UPDATE_DATETIME THEN qb.LAST_UPDATE_DATETIME ELSE qim.LAST_UPDATE_DATETIME END), item, barcode DESC  \
            )WHERE row_n BETWEEN "+start_ind+" AND "+row_resturn+" order by row_n asc";
        // console.log ('SQL :'+sql);typ
        const result = await connection.execute( sql);
        // console.log("Result :"+JSON.stringify(result));
        await connection.close();
        Item_Master = new Object();
        if ( !result || !result.rows || !result.rows.length){
            Item_Master['item_master'] = null;
        }else{
            for( let i = 0; i < result.rows.length; i++)
            {
                Item.push({item_no: result.rows[i][0], barcode: result.rows[i][1], item_desc: result.rows[i][2], update_datetime: result.rows[i][3], row_n: result.rows[i][4]});
            }
            Item_Master['item_master'] = Item;
        } 
        return Item_Master;
    }
       
}
// let data = new Database();
// data.getItem('2500008004928').then( obj => console.log( JSON.stringify(obj)));


// await oracledb.createPool({
//     user: 'hr',
//     password: myhrpw,  // myhrpw contains the hr schema password
//     connectString: 'localhost/XEPDB1',
//     poolAlias: 'hrpool'
//   });
  
//   await oracledb.createPool({
//     user: 'sh',
//     password: myshpw,  // myshpw contains the sh schema password
//     connectString: 'otherhost/OTHERDB',
//     poolAlias: 'shpool'
//   });
  
//   const connection = await oracledb.getConnection('hrpool');
  
//   const result = await connection.execute(
//         `SELECT manager_id, department_id, department_name
//          FROM departments
//          WHERE manager_id = :id`,
//         [103],  // bind value for :id
//       );
//       console.log(result.rows);