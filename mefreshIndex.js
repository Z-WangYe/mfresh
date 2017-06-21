const pool = require('./pool');
const qs = require('querystring');
module.exports  = {
    login:(req,res)=>{
        req.on('data',(buf)=>{
            var obj = qs.parse(buf.toString());
            console.log(obj);
            var unameOrPhone  = obj.unameOrPhone;
            var upwd = obj.upwd;
            pool.getConnection((err,conn)=>{
                if(err){
                    throw err;
                }else{
                    conn.query("SELECT uid,uname,phone FROM mf_user WHERE (uname=? AND upwd=?) OR (phone=? AND upwd=?)",
                        [unameOrPhone,upwd,unameOrPhone,upwd],(error,result)=>{
                            if(error){
                                throw error;
                            }else{

                                if(result){
                                    console.log(result);

                                    var obj = {code:1,uid:result[0].uid,uname:result[0].uname,phone:result[0].phone};
                                    res.json(obj);
                                }else{
                                  res.json({code:404});
                                }


                            }
                        })
                }
            })
        })

    },
    register:(req,res)=>{
        req.on('data',(buf)=>{
            var obj = qs.parse(buf.toString());
            console.log(obj);
            pool.getConnection((err,conn)=>{
                if(err){
                    throw err;
                }else{
                    var output = {};
                    output.uname = obj.uname;
                    conn.query("INSERT INTO mf_user VALUES(NULL,?,?,?)",[obj.uname,obj.upwd,obj.phone],(error,result)=>{
                        if(error){
                            throw error;
                        }else{

                            if(result){
                                output.code = 1;
                                output.uid = result.insertId;
                            }else{
                                output.code = 404;
                            }
                            res.json(output);
                            conn.release();
                        }
                    })
                }
            })
        })
    },
    new_page:(req,res)=>{
        req.on('data',(buf)=>{
            console.log(buf.toString());
            var pageNum = qs.parse(buf.toString()).pageNum;
            pool.getConnection((err,conn)=>{
                conn.query("SELECT COUNT(nid) FROM mf_news",(error,result)=>{
                    console.log(result[0]);
                    var obj = {};
                    obj.totalCount = 24;
                    obj.pageSize = 6;
                    obj.pageCount = Math.ceil(obj.totalCount/obj.pageSize);
                    var start = (pageNum-1)*obj.pageSize;
                    var count = obj.pageSize;
                    console.log(start,count);
                    conn.query("SELECT * FROM mf_news ORDER BY pubTime DESC LIMIT ?,?",[start,count],(error,data)=>{
                        if(error){
                            throw error;
                        }else{
                            console.log(data);
                            obj.data = data;
                            res.json(obj);
                            conn.release();
                        }
                    })
                })
            })
        })
    },
    new_detail:(req,res)=>{
        req.on("data",(buf)=>{
            console.log(buf.toString());
            var nid = qs.parse(buf.toString()).nid;
            pool.getConnection((err,conn)=>{
                if(err){
                    throw err;
                }else{
                    conn.query("SELECT * FROM mf_news WHERE nid=?",[nid],(error,result)=>{
                        if(error){
                            throw error;
                        }else{
                            res.json(result);
                            conn.release();
                        }
                    })
                }
            })
        })
    },
    product_page:(req,res)=>{
        req.on('data',(buf)=>{
            console.log(buf.toString());
            var type = qs.parse(buf.toString()).type;
            var pageNum = qs.parse(buf.toString()).pageNum;
            console.log(type,pageNum);
            var obj=  {};
            obj.pageNum = pageNum;
            obj.type = type;
            obj.pageSize = 3;
            pool.getConnection((err,conn)=>{
                conn.query("SELECT COUNT(*) FROM mf_product WHERE type=?",[type],(error,result)=>{
                    if(error){
                        throw error;
                    }else{
                        obj.totalRecord= result[0]['COUNT(*)'];
                        console.log(obj.totalRecord);
                        obj.pageCount = Math.ceil(obj.totalRecord/obj.pageSize);
                        console.log(obj.pageCount);
                        var start = (pageNum-1)*obj.pageSize;
                        var count = obj.pageSize;
                        conn.query("SELECT * FROM mf_product WHERE type=? ORDER BY pid DESC LIMIT ?,?",[type,start,count],(error,result)=>{
                            if(error){
                                throw error;
                            }else{
                                console.log(result);
                                obj.data = result;
                                res.json(obj);
                                conn.release();
                            }
                        })
                    }
                })


            })
        })
    },
    product_detail:(req,res)=>{
        req.on("data",(buf)=>{
            console.log(buf.toString());
            var pid = qs.parse(buf.toString()).pid;
            pool.getConnection((err,conn)=>{
                if(err){
                    throw err;
                }else{
                    conn.query("SELECT * FROM mf_product WHERE pid=?",[pid],(error,result)=>{
                        if(error){
                            throw error;
                        }else{
                            console.log(result);
                            res.json(result);
                            conn.release();
                        }
                    })
                }
            })
        })
    }
}
