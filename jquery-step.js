/**
 * Created by wangqiong on 2017/3/5.
 * 为项目实现一步步标志的插件
 * option:
 *      height:70 控件的高度
 *      datas:[{text:string,icon:string,},...] 填充控件的数据,text是文本,icon是图标
 *      checked:[0] 初始化时选中第几项
 *      position:"left" 内容是靠左显示还是中间显示
 *      mark:"check" check||number,是使用什么下标标识,check是对号,number是数字
 *      markPosition:"bottom" bottom||top,下标标志的位置,bottom是在底部,top是在顶部
 *      iconFormatter:function(value,data) 图标格式化函数,value是当前数据的icon值,data是当前数据
 *
 * function
 *      check function(new Array) 选中参数数组中提供的索引位置的元素
 */
(function($){
    if($.fn.step){
        return;
    }
    var setMethods={
        check:check
    };
    var getMethods={

    };
    $.fn.step=function(){
        var args=arguments,params,method;
        if(!args.length|| typeof args[0] == 'object'){
            return this.each(function(idx){
                var $self=$(this);
                $self.data('step',$.extend(true,{},$.fn.step["default"],args[0]));
                params=$self.data('step');
                _init.call( $self,params);
                _render.call($self);
            });
        }else{
            if(!$(this).data('step')){
                throw new Error('You has not init step!');
            }
            params=Array.prototype.slice.call(args,1);
            if (setMethods.hasOwnProperty(args[0])){
                method=setMethods[args[0]];
                return this.each(function(idx){
                    var $self=$(this);
                    method.apply($self,params);
                    _render.call($self);
                });
            }else if(getMethods.hasOwnProperty(args[0])){
                method=getMethods[args[0]];
                return method.apply(this,params);
            }else{
                throw new Error('There is no such method');
            }
        }
    }
    $.fn.step["default"]={
        height:70,
        datas:[],
        checked:[0],
        position:"left",
        mark:"check",/*check||number*/
        markPosition:"bottom",/*bottom||top*/
        iconFormatter:function(icon,data){
            return icon;
        }
    }
    function check(checked){
        var $self=this,
            params=$self.data("step");
        params.checked=checked;
        _render.call($self);
    }
    function _init(params){
        return this;
    }
    function _render(){
        var $self=this,
            params=$self.data("step"),
            datas=params.datas||[],
            checked=params.checked,
            preWidth=100/datas.length+"%";
        $self.addClass("step-container").height(params.height).html(
            datas.map(function(data,idx){
                var step = $("<div/>",{
                    "class":function(){
                        if($.inArray(idx,checked)!=-1){
                            return "step step-check"
                        };
                        return "step";
                    }
                }).append(
                    $("<div/>",{
                        "class":function(){
                            var cls="step-content-container";
                            if(params.markPosition=="bottom"){
                                cls+=" step-top";
                            }else{
                                cls+=" step-bottom";
                            }
                            if(params.position!="left"){
                                cls+=" step-center";
                            }
                            return cls;
                        }()
                    }).append(
                        $("<div/>",{
                            "class":function(){
                                if(params.position=="left"){
                                    return "step-content-inner step-left";
                                }
                                return "step-content-inner";
                            }()
                        }).append(
                            function(){
                                if(data.icon){
                                    return $("<div/>",{
                                        "class":"step-icon",
                                        "html":params.iconFormatter(data.icon,data)
                                    })
                                }
                            }(),
                            $("<div/>",{
                                "class":"step-content",
                                "html":data.text
                            })
                        )
                    ),
                    $("<div/>",{
                        "class":function(){
                            var cls="step-mark-container";
                            if(params.markPosition=="bottom"){
                                cls+=" step-bottom";
                            }else{
                                cls+=" step-top";
                            }
                            if(params.position=="left"){
                                cls+=" step-mark-container-left";
                            }
                            return cls;
                        }()
                    }).append(
                        function(){
                            if(params.position!="left"||idx!=datas.length-1){
                                return $("<div/>",{
                                    "class":"step-mark-bg"
                                })
                            }
                        }(),
                        $("<div/>",{
                            "class":"step-mark"
                        }).append(
                            $("<div/>",{
                                "class":"step-mark-inner"
                            }).append(
                                $("<div/>",{
                                    "class":function(){
                                        if(params.position=="left"){
                                            return "step-mark-symbol step-left";
                                        }
                                        return "step-mark-symbol"
                                    }()
                                }).append(
                                    $("<span/>",{
                                        "class":"step-mark-symbol-content",
                                        "html":function(){
                                            if(params.mark=="check"){
                                                return "&#10003;"
                                            }else if(params.mark=="number"){
                                                return idx+1;
                                            }else{
                                                return params.mark;
                                            }
                                        }
                                    })
                                )
                            )
                        )
                    )
                );
                if(params.position!="left"||idx!=datas.length-1){
                    step.css({"width":preWidth});
                }
                return step;
            })
        )
    }
})(jQuery);