var questions=[];

var tcn_qlist;
var tcn_alist;
var tcn_prop;

var yesnos = {"Spagetti":
	      {"Yellow?":
	       [3,8],
	       "Noodle?":
	       [1,8],
	       "Japanese Food?":
	       [8,3],
	       "Main Dish?":
	       [1,8],
	       "Spicy?":
	       [6,2],
	       "Is drink?":
	       [6,2],
	      },
	      "Sake":
	      {"Yellow?":
	       [8,1],
	       "Noodle?":
	       [8,1],
	       "Japanese Food?":
	       [6,4],
	       "Main Dish?":
	       [8,1],
	       "Spicy?":
	       [6,3],
	       "Is drink?":
	       [1,8],
	      },
	      "Coke":
	      {"Yellow?":
	       [8,1],
	       "Noodle?":
	       [8,1],
	       "Japanese Food?":
	       [8,1],
	       "Main Dish?":
	       [8,1],
	       "Spicy?":
	       [8,1],
	       "Is drink?":
	       [1,8],
	      },
	      "Hamburger":
	      {"Yellow?":
	       [6,3],
	       "Noodle?":
	       [8,1],
	       "Japanese Food?":
	       [8,1],
	       "Main Dish?":
	       [3,6],
	       "Spicy?":
	       [8,1],
	       "Is drink?":
	       [8,1],
	      },
	      "Pizza":
	      {"Yellow?":
	       [7,2],
	       "Noodle?":
	       [8,1],
	       "Japanese Food?":
	       [8,1],
	       "Main Dish?":
	       [1,8],
	       "Spicy?":
	       [4,4],
	       "Is drink?":
	       [8,1],
	      },
	      "Ramen":
	      {"Yellow?":
	       [3,5],
	       "Noodle?":
	       [1,8],
	       "Japanese Food?":
	       [1,8],
	       "Main Dish?":
	       [1,8],
	       "Spicy?":
	       [4,4],
	       "Is drink?":
	       [8,1],
	      },
	      "Curry":
	      {"Yellow?":
	       [6,3],
	       "Noodle?":
	       [8,1],
	       "Japanese Food?":
	       [5,4],
	       "Main Dish?":
	       [1,8],
	       "Spicy?":
	       [1,8],
	       "Is drink?":
	       [8,1],
	      }
};


var ks_info = {
    "Spagetti":{refURL : "https://en.wikipedia.org/wiki/Spaghetti",
	    refImgURL:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Pasta_Puttanesca.jpg/720px-Pasta_Puttanesca.jpg"},
    "Sake":{refURL : "https://en.wikipedia.org/wiki/Sake",
	    refImgURL:"https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Sake_set.jpg/440px-Sake_set.jpg"},
    "Coke":{refURL : "https://en.wikipedia.org/wiki/Coca-Cola",
	    refImgURL:"https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/15-09-26-RalfR-WLC-0098.jpg/440px-15-09-26-RalfR-WLC-0098.jpg"},
    "Hamburger":{refURL : "https://en.wikipedia.org/wiki/Hamburger",
	    refImgURL:"https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/RedDot_Burger.jpg/500px-RedDot_Burger.jpg"},
    "Pizza":{refURL : "https://en.wikipedia.org/wiki/Pizza",
	    refImgURL:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Eq_it-na_pizza-margherita_sep2005_sml.jpg/440px-Eq_it-na_pizza-margherita_sep2005_sml.jpg"},
    "Ramen":{refURL : "https://en.wikipedia.org/wiki/Ramen",
	    refImgURL:"https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Soy_ramen.jpg/500px-Soy_ramen.jpg"},
    "Curry":{refURL : "https://en.wikipedia.org/wiki/Curry",
	    refImgURL:"https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Curry_rice_by_Hyougushi_in_Kyoto.jpg/440px-Curry_rice_by_Hyougushi_in_Kyoto.jpg"},
};

var ks = Object.keys(yesnos);
var data_keys = Object.keys(yesnos[ks[0]]);
for(var i = 0; i < data_keys.length; i++){
    questions.push(data_keys[i]);
}

function getBestEstimate(prop){
    var maxEstimate = 0;
    var maxEstimateChara = "";
    var maxIndex = 0;

    for (var i  = 0 ; i <  ks.length; i++){
	if(maxEstimate < prop[ks[i]]){
	    maxEstimate = prop[ks[i]];
	    maxEstimateChara = ks[i];
	    maxIndex = i;
	}
    }

    return {maxest: maxEstimate, maxestchara : maxEstimateChara, maxindex:maxIndex};
}

function isLastQuestion(prop){
    var result = getBestEstimate(prop);
    if(result.maxest > 0.5){
	return {result:true, detail:result};
    }else{
	return {result:false, detail:result};
    }
}

function initProp(){
    prop = {};
    for(var i = 0; i < ks.length;i++){
	prop[ks[i]] = 1.0 / ks.length;
    }
    return prop;
}

function initGameState() {
    tcn_qlist = [];
    tcn_alist = [];
    tcn_prop = {};
    
    //初めの質問を選択
    prop = initProp();
    var q = decideQ(prop, []);
    
    var firstQuestion = {name:q.newQTitle, questionid:q.newQId};

    tcn_qlist = [firstQuestion.questionid];
    tcn_alist = [];
    tcn_prop = prop;


    $("#q").attr("questionId", firstQuestion.questionid);
    $("#q").html(firstQuestion.name+" ?");
    var candidate = "<b><u>"+ks[0];
    for(var i = 1; i < ks.length;i++){
	candidate += ", ";
	candidate += ks[i];
    }
    candidate += "</u></b>";
    $("#candidate-word").html(candidate);
};

function updateFromStart(qlist, alist, prop, ans, qId){
    var newProp = initProp();

    for (var i = 0 ; i < qlist.length; i++){

	var tmpans = alist[i];
	if(qlist[i] == qId){
	    tmpans = ans;
	}

	newProp = updateP(newProp, qlist[i], tmpans, true);

	var lastProp = isLastQuestion(newProp);
	var isFinalAns = lastProp.result;
	if(isFinalAns){
	    break;
	}
    }
    return [newProp, i];
}

function updateP(prop, qindex, a, isId){
    var new_p = {};
    var base_p = 0;  
    var q = questions[qindex];

    //あらかじめ計算可能
    for(var i = 0; i < ks.length; i++){
	var kid = ks[i];
	base_p += (yesnos[kid][q][a]/(yesnos[kid][q][0]+yesnos[kid][q][1])) * prop[kid];
    }

    for(var i = 0; i < ks.length; i++){
	var kid = ks[i];
	new_p[kid] = 1.0 / base_p * prop[kid] * (yesnos[ks[i]][q][a]/(yesnos[kid][q][0]+yesnos[kid][q][1]));
    }
    
    return new_p;
}

function calculateE(prop){
    var entropy = 0;
    for (var index = 0; index < ks.length; index++){
	entropy += - prop[ks[index]] * Math.log2(prop[ks[index]]);
    }
    return entropy;    
}

function calculateGainE(cur_e, qindex, prop){
    var w_0 = 0;

    var q = questions[qindex];
    for (var index = 0; index < ks.length; index++){
	var kid = ks[index];
	w_0 += prop[kid] * (yesnos[kid][q][0]/(yesnos[kid][q][0]+yesnos[kid][q][1]));
    }
    var p_0 = updateP(prop, qindex, 0, false);
    var e_0 = calculateE(p_0);

    var w_1 = 1 - w_0;
    
    var p_1 = updateP(prop, qindex, 1, false);
    var e_1 = calculateE(p_1);

    return cur_e - (w_0 * e_0 + w_1 * e_1);
}

function decideQ(prop, qlist){
    var qId = -1;
    var title = "";
    var max_e = -10000000;
    var max_e_q = "";
    var max_e_q_i = -1;

    var cur_entropy = calculateE(prop);

    for (var i = 0; i < questions.length; i++){
	if (qlist.includes(i)){
	    continue;
	}else{
	    var e = calculateGainE(cur_entropy, i, prop);
	    if (max_e < e){
		max_e = e;
		max_e_q = questions[i];
		max_e_q_i = i;
	    }
	}
    }

    return {newQId: max_e_q_i, newQTitle:max_e_q, newQMaxE:max_e};
}

function genSuggests(prop){
    suggests = [];

    // Create items array
    var items = Object.keys(prop).map(function(key) {
	    return [key, prop[key]];
	});

    // Sort the array based on the second element
    items.sort(function(first, second) {
	    return second[1] - first[1];
	});

    // Create a new array with only the first 5 items
    topids = items.slice(0, 2);

    for (var itemindex = 0; itemindex < topids.length; itemindex++){
	var targetindex = topids[itemindex][0];
	
	for (var kindex = 0; kindex < ks.length; kindex++){
	    if(ks[kindex] == targetindex){
		suggests.push({name:ks[kindex],
			    ansRefURL:ks_info[ks[kindex]].refURL,
			    ansRefImgURL:ks_info[ks[kindex]].refImgURL,
			    rate: topids[itemindex][1]
			});
		break;
	    }
	}
    }

    return suggests;
}

function returnResult(qlist, alist, prop, needNewQuestion, ans, qId){
    var isFinalAns = false;
    var lastProp;
    var lastIndex = -1;

    if(needNewQuestion){
	console.log(qlist.length + " : " + questions.length);
	if(qlist.length == questions.length){
	    isFinalAns = true;
	    var result = getBestEstimate(prop);
	    lastProp = {result:true, detail:result};
	}else{
	    prop = updateP(prop, qlist[qlist.length-1], ans, true);
	    lastProp = isLastQuestion(prop);
	    isFinalAns = lastProp.result;
	}
    }else{
	tmpprop = updateFromStart(qlist, alist, prop, ans, qId);
	lastProp = isLastQuestion(tmpprop[0]);
	lastIndex = tmpprop[1];
	isFinalAns = false;
    }
    
    
    var data;
    if(isFinalAns && needNewQuestion){
	var suggests = genSuggests(prop);
	data= {"isFinal":true,
	       "finalAns" : lastProp.detail,
	       "suggests":suggests
	};

	alist.push(ans);

	tcn_alist = alist;
	tcn_prop = prop;
    }else if( !needNewQuestion){
	var suggests = genSuggests(tmpprop[0]);
	data= {"isFinal":false,
	       "updateAns" : lastProp.detail,
	       "suggests":suggests,
	       "lastIndex" : lastIndex
	};

	for(var i = 0 ; i < qlist.length; i++){
	    if(qlist[i] == qId){
		alist[i] = ans;
	    }
	}

	tcn_alist = alist;
	tcn_prop = prop;
    }else{
	var suggests = genSuggests(prop);

	var q = decideQ(prop, qlist);
	var newNextQuestion = q.newQId;
	data= {"isFinal":false,
	       "nextQuestion":q.newQTitle,
	       "nextQuestionId": newNextQuestion,
	       "suggests":suggests
	};
	
	qlist.push(newNextQuestion);
	alist.push(ans);

	tcn_qlist = qlist;
	tcn_alist = alist;
	tcn_prop = prop;
    }
    
    return {"msg":"ok",  "result":data};
}


function updateYesNo (ans , qId){
    var qlist = tcn_qlist;
    var alist = tcn_alist;
    var prop  = tcn_prop;
    return returnResult(qlist, alist, prop, false, ans, qId);
};

function selectYesNo(ans){
    var qlist = tcn_qlist;
    var alist = tcn_alist;
    var prop  = tcn_prop;
    return returnResult(qlist, alist, prop, true, ans, -1);
};

function appendToSuggestZone(suggests){
    $("#suggest-knowledges-raw").html("");
    var suggestHtml = "";

    if(suggests){
	for(var i = 0; i < suggests.length; i++){
	    var specialString = "";
	    if(suggests[i]["rate"] && parseInt(suggests[i]["rate"]*100) > 1){
		specialString = "("+parseInt(suggests[i]["rate"]*100)+"%)";
	    }
	    suggestHtml += "<div class='suggest-knowledge-panel'>"
		+"<img width='120px' height='120px' src='"+suggests[i]["ansRefImgURL"]+"'></img>"
		+"<a style='color:white;text-decoration:none;' target='_blank' rel='noopener noreferrer'  href='"+suggests[i]["ansRefURL"]+"'><div>"+(i+1)+". "+suggests[i]["name"]+specialString+"</div></a>"
		+"</div>";
	}
    }
    
    $("#suggest-knowledges-raw").html(suggestHtml).hide().show("slow");
}

function addNewLineToQuestionHistory(ans, prevQuestion, qid){
    var yesno = "No";
    var yesnoclass = "q-ans-cell-no";
    if(ans > 0){
	yesno = "Yes";
	yesnoclass = "q-ans-cell-yes";
    }

    $("#q-hist-table").attr("tablenum", parseInt($("#q-hist-table").attr("tablenum"))+1);

    var newLine = "<div style='display:table-row;'><div class='index-cell'>"+
	+ $("#q-hist-table").attr("tablenum")
	+ "</div><div class='q-cell'>"
	+ prevQuestion
	+ "</div><div class='q-ans-cell " + yesnoclass + "' questionid='"+qid+"'>"
	+ yesno
	+"</div></div>";
    $("#q-hist-table").append(newLine);
}

function disableFunctions(){
    $("#yes-button").css("background-color", "gray");
    $("#no-button").css("background-color", "gray");
    $("#yes-button").css("color", "white");
    $("#no-button").css("color", "white");
    $("#reset-thothnator").css("font-size", "60px");
    $("#reset-thothnator").css("padding", "20px");
}

function answer(ans){
    var result = selectYesNo(ans);
    var target = result.result;
    var suggests = target["suggests"];
    appendToSuggestZone(suggests);
    
    //Update Question
    var prevQuestion = $("#q").html();
    var prevQid = $("#q").attr("questionId");
    if(target.isFinal){

	console.log("target");
	console.log(target);
	$("#q").html(target["finalAns"]["maxestchara"]+" !?");
	$("#q").attr("questionId", "");
	disableFunctions();
    }else{
	$("#q").html(target["nextQuestion"]);
	$("#q").attr("questionId", target["nextQuestionId"]);
    }
    
    //Add New Line to Question History
    addNewLineToQuestionHistory(ans, prevQuestion, prevQid);
}

function updateAnswer(ans, qid){
    var result = updateYesNo (ans , qid);
    var target = result.result;
    var suggests = target["suggests"];
    appendToSuggestZone(suggests);

    $(".q-ans-cell").removeClass("not-used-in-update");
    $(".q-ans-cell:gt("+target["lastIndex"]+")").addClass("not-used-in-update");

    if($("#q").attr("questionId").length == 0){
	$("#q").html(target["updateAns"]["maxestchara"]+" !?");
	$("#q").attr("questionId", "");
    }
}

$(document).ready(function(){
	initGameState();
	$(document).on('click',".q-ans-cell", function(){
		if($("#q").attr("questionId").length == 0){		    
		    var target=$($(this)[0]);
		    var ans = 0;
		    if($(this).hasClass("q-ans-cell-yes")){
			target.html("No");
		    }else{
			target.html("Yes");
			ans = 1;
		    }
		    target.toggleClass("q-ans-cell-yes");
		    target.toggleClass("q-ans-cell-no");
		    updateAnswer(ans, target.attr("questionId"));
		}
	    });
	
	$("#yes-button").on("click",function(){
		if($("#q").attr("questionId").length > 0){
		    answer(1);
		}
	    });

	$("#no-button").on("click",function(){
		if($("#q").attr("questionId").length > 0){
		    answer(0);
		}
	    });
    });
