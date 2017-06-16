const qs = require("querystring");
const pool = require("./pool");
module.exports = {
    phone_check:(req,res)=>{
        req.on("data",(buf)=>{
            var phone = qs.parse(buf.toString()).phone;
            console.log(phone);
            pool.getConnection((err,conn)=>{
                if(err){
                    throw err;
                }else{
                    conn.query("SELECT uid FROM mf_user WHERE phone=?",[phone],(error,result)=>{
                        console.log(result);
                        var obj = {};
                        if(result.length==0){
                            obj.code=2;
                            obj.msg="non-exist";
                        }else{
                            obj.code=1;
                            obj.msg="exist";
                        }
                        res.json(obj);
                    })
                }
            })
        })
    },
    uname_check:(req,res)=>{
        req.on("data",(buf)=>{
            var uname = qs.parse(buf.toString()).uname;
            console.log(uname);
            pool.getConnection((err,conn)=>{
                if(err){
                    throw err;
                }else{
                    conn.query("SELECT uid FROM mf_user WHERE uname=?",[uname],(error,result)=>{
                        console.log(result);
                        var obj = {};
                        if(result.length==0){
                            obj.code=2;
                            obj.msg="non-exist";
                        }else{
                            obj.code=1;
                            obj.msg="exist";
                        }
                        res.json(obj);
                    })
                }
            })
        })
    }
}
