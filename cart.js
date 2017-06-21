const qs = require("querystring");
const pool = require("./pool");
module.exports = {
    cart_add:(req,res)=>{
        req.on("data",(buf)=>{
            console.log(buf.toString());
            var obj = qs.parse(buf.toString());
            var uid = obj.uid;
            var pid = obj.pid;
            console.log(uid);
            pool.getConnection((err,conn)=>{
                if(err){
                    throw err;
                }else{
                    conn.query("SELECT cid FROM mf_cart WHERE userId=?",[uid],(error,result)=>{
                        if(error){
                            throw error;
                        }else{
                            console.log(result);
                            var cid;
                            if(result.length!=0){
                                 cid = result[0].cid;
                            }else{
                                conn.query("INSERT INTO mf_cart VALUES(NULL, ?)",[uid],(error,data)=>{
                                    console.log(data);
                                     cid = data.insertId;
                                })
                            }
                            conn.query("SELECT did,count FROM mf_cart_detail WHERE cartId=? AND productId=?",[cid,pid],(error,product)=>{
                                console.log(product);

                                if(product.length!=0){
                                     var count = product[0].count;
                                    count++;
                                    conn.query("UPDATE mf_cart_detail SET count=? WHERE cartId=? AND productId=?",[count,cid,pid])
                                }else{
                                    var count=1;
                                    conn.query("INSERT INTO mf_cart_detail VALUES(NULL,?, ?, ?)",[cid,pid,count]);
                                }
                            })
                            res.json({code:1,msg:"succ",productCount:1});
                            conn.release();
                        }
                    });

                }

            })
        })
    },
    cart_select:(req,res)=>{
        req.on("data",(buf)=>{
            console.log(buf.toString());
            var uid = qs.parse(buf.toString()).uid;
            var obj = {};
            pool.getConnection((err,conn)=>{
                if(err){
                    throw err;
                }else{
                    conn.query("SELECT pid,title1,pic,price,count,did FROM mf_product,mf_cart_detail WHERE mf_cart_detail.productId=mf_product.pid AND pid IN (SELECT productId FROM mf_cart_detail WHERE cartId=(SELECT cid FROM mf_cart WHERE userId=?)) AND mf_cart_detail.cartId=(SELECT cid FROM mf_cart WHERE userId=?)",[uid,uid],(error,result)=>{
                        console.log(result);
                        obj.uid = uid;
                        obj.data = result;
                        res.json(obj);
                        conn.release();
                    })
                }
            })
        })
    },
    cart_delete:(req,res)=>{
        req.on("data",(buf)=>{
            console.log(buf.toString());
            var did = qs.parse(buf.toString()).did;
            pool.getConnection((err,conn)=>{
                if(err){
                    throw err;
                }else{
                    conn.query("DELETE FROM mf_cart_detail WHERE did=?",[did],(error,result)=>{
                        console.log(result);
                        if(result){
                            res.json({code:1,msg:"succ"});
                        }else{
                            res.json({code:404});
                        }
                        conn.release();
                    });
                }
            })
        })
    }
}
