$(function(){
    $(".header_box").load("header.html",function(){
        main();
    });
    $(".footer").load("footer.html");

    $(".cart_con>ul").on("click","em",function(){
        var thisLi=$(this).parent();
        var did=$(this).siblings(".cart_title").attr("data-did");
        console.log(did);
        $.ajax({
            type:"post",
            url:"/cart_delete",
            data:{did:did},
            success:function(d){
                if(d.code==1){
                    thisLi.remove();
                    cartUpdate(sessionStorage.uid);
                    cartPost();
                }
            }
        });
    });



    if(sessionStorage.uid){
        cartPost();
    }
});
var cartPost = function(){
    $.ajax({
        type:"post",
        url:"/cart_select",
        data:{uid:sessionStorage.uid},
        success:function(d){
            //console.log(d);
            var data= d.data;
            var listHtml="";
            var count=0;
            var total =0;
            for(var i=0;i< data.length;i++){
                var pn=data[i].price*data[i].count;
                listHtml+='<li><input type="checkbox" class="cart_checkbox"/><a href="" class="cart_img"><img src="'
                +data[i].pic
                +'" alt=""/></a><a href="" class="cart_title" data-did="'
                +data[i].did
                +'">'
                +data[i].title1
                +'</a><i>'
                +data[i].price
                +'</i><div><span>-</span><input type="text" value="'
                +data[i].count
                +'"/><span>+</span></div><strong>'
                +pn.toFixed(2)
                +'</strong><em></em></li>';
                count+=parseInt(data[i].count);
                total+=pn;
            }
            $(".cart_con>ul").html(listHtml);

            var cart_footer_html = `
                    <span>已选商品<em>${data.length}</em>件</span>
                    <span>总金额：<strong>${total}</strong></span>
                    <button type="button">结算</button>
                `

            $(".cart_header").html(cart_footer_html);
        }
    });
}