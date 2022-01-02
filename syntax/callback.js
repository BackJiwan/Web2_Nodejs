// var a =function(){
//   console.log('A');
// }
// //a();
// console.log('B');
// function slowfunc(callback){
//   callback();
// }
// console.log('C');
// slowfunc(a);
// console.log('D')

//비동기 처리의 사례 -1
function getData() {
	var tableData;
	$.get('https://domain.com/products/1', function(response) {
		tableData = response;
	});
	return tableData;
}

console.log(getData()); // undefined


//위의 사례를 해결한 경우 콜백함수를 이용해서 사례 -2
var c = function(tableData) {
	console.log(tableData); // $.get()의 response 값이 tableData에 전달됨
}

function getData(callbackFunc) {
	$.get('https://domain.com/products/1', function(response) {
		callbackFunc(response); // 서버에서 받은 데이터 response를 callbackFunc() 함수에 넘겨줌
	});
}

getData(c);
//callbackFunc == c

//조금더 프로그래밍 적인 콜백함수를 이용한 식 사례 -3
function getData(callbackFunc) {
	$.get('https://domain.com/products/1', function(response) {
		callbackFunc(response); // 서버에서 받은 데이터 response를 callbackFunc() 함수에 넘겨줌
	});
}

getData(function(tableData) {
	console.log(tableData); // $.get()의 response 값이 tableData에 전달됨
});



내가 콜백에 관해서 이해한 사실
1. 비동기 처리의 사례로 나와있는 getData함수는 도메인에서 데이터를 가지고와서 response로 반환한다.
2. 반환값인 response를 tableData에 저장한다.
3. 이후 tableData를 리턴하고 다음 문장으로 getData함수를 호출하고 출력하는것으로 리턴값인 tableData를 출력하고자 하지만
4. 비동기 처리로 인해 함수 getData가 채 정보를 가지고 리턴하기도 전에 console출력문이 먼저 실행되어
5. undefined를 출력하게 된다 .
6. 하지만 콜백함수를 이용하는 경우는 위의 비동기 처리 사례에서 볼수 있듯이 함수의 응답을 기다려주지 않고 아래 줄의 문법들을 실행해버리는 특성을 이용하여
7. 4번의 출력자리에 출력대신  getData함수를 호출하는데 이때 직접 변수를 호출하는 대신 출력을 기능을 가진 함수를(결국 이 함수가 콜백함수이다) 대신 매개변수로 다시 getData함수로 넣어주는 작업을한다.
8. 이 작업으로 다시 getData에 진입하여 서버에서 받은 데이터(response)를 콜백함수(변수 c에 저장된 함수) 에 넘겨준다.

콜백함수 예제에서만 살펴보자면(사례-3)
1. 순차적으로 getData() 함수가 실행된다
2. 내부에는 도메인에서 데이터를 가져오는 기능을 구현중이고 이것을 response에 담는다.
2-1. 여기서 데이터를 가져오는 시간이 소모되기 때문에 데이터를 가져오는 갈래가 생긴다.
3. 다른 하나의 갈래는 데이터를 다 가져오기 전에 가장큰 줄기가 쭈욱 아래로 실행되는 것이다.
4. 아직 데이터는 다 받아지지 않았고 큰 흐름은 getData함수에 당면하여 getData(인자A)의 형태로 함수를 호출한다.
5. getData함수룰 호출하니 getData함수에 매개변수로 (tableData를 출력하고자 하는 함수)를 전달한다.
6-1. 2-1의 갈래에서 데이터를 다가지고 와서 response에 데이터가 담겼다.
7-1. response에 데이터가 담기니 이것이 callbackFunc의 인자로 전달되어 콜백함수가 선언이 완료된다. 
8. 이시점에 콜백함수가 선언및 호출이 완성되고 5번에서 매개변수자리로 인자로 들어온 tableData를 출력하고자 하는 함수가 드디어 내부의 callbackFunc자리로 차고 들어와서 response를 품에안고 콜백함수의 자리에서 출력 기능을 가진 함수를 실행한다 (결국은 이름은 다르지만 getData내부에 있는 함수 = 콜백함수 )
