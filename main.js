        var currentIndex = 0, qa = [], total = 0, sel_cnt=0, frac_top=0, frac_bottom=0;
        $(function() {
		
		
		$(".nav li:nth-child("+(Math.floor(Math.random() * $('.nav li').length )+1)+") a").addClass("active");
		
		selectquiz( $(".nav").find(".active").text() );
		
		$(".nav a").on("click", function(){
		
			$(".nav").find(".active").removeClass("active");
			$(this).addClass("active");
			
			if (  $(this).text() ==='複習錯題'){
				//sel_cnt=0; qa=[];
				
		
				getAllquiz(function(qadata, selcount){
					
					if ( qadata.length!=0 ){
						qa = qadata;sel_cnt = selcount;currentIndex=0;total = qa.length;
						showQuiz();
						$(".btn-outline-danger").text('清除錯題');
						$("a#ori-pdf").attr('href', '' )
							.text( '' );
					}
					else{
						alert('沒有錯題');
					}
				});
			
			}
			else if ( $(this).text() === '清除錯題' ){
				$(".btn-outline-danger").text('複習錯題');
				 clearquiz();
			}
			else{
				selectquiz( $(this).text() );	
			}
		});
	

          $('.qa-previous').click(function() {
            currentIndex -= 1;
            if(currentIndex < 0) {
              currentIndex = total - 1;
            }
            showQuiz();       
          });
          $('.qa-next').click(function() {
            currentIndex += 1;
            if(currentIndex >= total) {
              currentIndex = 0;
            }
            showQuiz();            
          });
          $('.qa-jump').click(function() {
            currentIndex = window.prompt('輸入 1-' + total + ' 數字');
            currentIndex = parseInt(currentIndex) - 1;
            showQuiz();            
          });
		
		$('.qa-random').click(function() {
	    currentIndex = Math.floor(Math.random() * qa.length);
            showQuiz();
          });
		  
	
        })

		
		function selectquiz(txt){
			
			if (txt === '複習錯題' || txt === '清除錯題'){

				return;
			}
			
			$(".btn-outline-danger").text('複習錯題');
			
			$("a#ori-pdf").attr("href", txt +'題庫.pdf' );
			
			
			$('.navbar-brand').text( txt );
			
			qa = [];
			
			$.get(txt+'題庫.txt', function(data) {
			
			let line = data.split('\r');
			//let line_split =[];
			let section='';
				
			$("a#ori-pdf").attr("href", txt +'題庫.pdf' )
						.text( line[0].split('：')[1]+txt +'題庫' );	
			
			for (var i=0; i<line.length; i++){			
				if (line[i].replace(/\n/g, '') ==='選擇題')
					section = '選擇題';
				
				if (line[i].replace(/\n/g, '') ==='是非題'){
					section = '是非題';
					sel_cnt = qa.length;
					}
					
				if (line[i].replace(/\n/g, '') ==='依據法源'){
					if (section ==='選擇題')
						section = '選擇題&依據法源';
					else{
						section = '是非題&依據法源';
						sel_cnt = qa.length;
					}
				}
						
			switch ( section ) {
				
				case '選擇題':
						if( !isNaN(parseInt(line[i])) ){			

							//line_split = line[i+2].split('(');
							qa.push({
							"quiz": line[i]+'.'+ line[i+2].slice(0, line[i+2].indexOf('(1')),//line_split[0],
							"options": {
							"1": line[i+2].slice(line[i+2].indexOf('(1'), line[i+2].indexOf('(2')),//'('+line_split[1],
							"2": line[i+2].slice(line[i+2].indexOf('(2'), line[i+2].indexOf('(3')),//'('+line_split[2],
							"3": line[i+2].slice(line[i+2].indexOf('(3'), line[i+2].indexOf('(4')),//'('+line_split[3],
							"4": line[i+2].slice(line[i+2].indexOf('(4'), line[i+2].length)//'('+line_split[4]
							},
							"answer":line[i+1],
							"ref":""
							});
						  i += 2;			
						}
					break;
				case '選擇題&依據法源':
					if( !isNaN(parseInt(line[i])) ){
						
							//line_split = line[i+2].split('(');
							qa.push({
							"quiz": line[i]+'.'+ line[i+2].slice(0, line[i+2].indexOf('(1')),//line_split[0],
							"options": {
							"1": line[i+2].slice(line[i+2].indexOf('(1'), line[i+2].indexOf('(2')),//'('+line_split[1],
							"2": line[i+2].slice(line[i+2].indexOf('(2'), line[i+2].indexOf('(3')),//'('+line_split[2],
							"3": line[i+2].slice(line[i+2].indexOf('(3'), line[i+2].indexOf('(4')),//'('+line_split[3],
							"4": line[i+2].slice(line[i+2].indexOf('(4'), line[i+2].length)//'('+line_split[4]
							},
							"answer":line[i+1],
							"ref": line[i+3]
							});
								
							i += 3;
					}
					break;	
				case '是非題':		
						if( !isNaN(parseInt(line[i])) ){					
							qa.push({
							"quiz": line[i]+'.'+line[i+2],
							"options": {
							"O": "O",
							"X": "X"
							},
							"answer":line[i+1],
							"ref": ""
							});
						
							i += 2;
						}
					break;
				case '是非題&依據法源':
					if( !isNaN(parseInt(line[i])) ){										
							qa.push({
							"quiz":line[i]+'.'+ line[i+2],
							"options": {
							"O": "O",
							"X": "X"
							},
							"answer":line[i+1],
							"ref": line[i+3]
							});
						
							i += 3;				
					}
					break;	
				default:
					//console.log(`nothing here:` + line[i] );
			}//end of switch
			
			}//end of for loop

			 total = qa.length;
			
			//random quiz
			currentIndex = Math.floor(Math.random() * qa.length);	
				
            showQuiz();
			
		}, 'text'); //end of get jquery
		}
		
        function showQuiz() {

		window.scrollTo(0, 0);
		
          if (currentIndex > qa.length)
			currentIndex=0;
			
		  $('#qa-result').html('');
          $('#qa-quiz').html(qa[currentIndex].quiz);
          var answers = '';
          for(k in qa[currentIndex].options) {
            answers +=  '<div class="form-check"><input class="form-check-input qa-options" type="radio" name="answer"  id="' + k + '" value="' + k + '">' +
						'<label class="form-check-label" for="'+ k +'">'+qa[currentIndex].options[k]+'</label></div>';
          }
          $('#qa-answer').html(answers);
		
          $('input.qa-options').change(function() {	      
            var selected = $(this).val();
            if(selected == qa[currentIndex].answer) {
				$('#qa-result').css({'color':'green'});
				
				$('#qa-result').html("你答對了！");
				
				frac_top++;frac_bottom++;
            } else {
				$('#qa-result').css({'color':'red'});
				
              $('#qa-result').html("你答錯了！正確答案應該是 -> " + qa[currentIndex].options[qa[currentIndex].answer] + "<br>"+ qa[currentIndex].ref );
			  frac_bottom++;
			  saveIndexedDB(qa[currentIndex]);
            }
			
			$('.frac span.bottom').text(frac_bottom);
			$('.frac span.top').text(frac_top);
			
			let pass= frac_top/frac_bottom*100;

			if ( pass < 70 )
				$('.percent').css({'color':'red','font-weight': 'bold'});				
			else
				$('.percent').css({'color':'green'});	
		
			$('.percent').val( (frac_top/frac_bottom*100).toFixed(1));
			
			window.scrollTo(0, document.body.scrollHeight);
          });
          //$('div#qa-status').html('第 ' + (currentIndex + 1) + ' 題 / 共 ' + total + ' 題(選擇：'+sel_cnt+' 是非：'+(total-sel_cnt)+')');
		  let valeur =((currentIndex + 1)/total*100).toFixed(1);
		  $('.progress-bar').css('width', valeur +'%')
							.attr('aria-valuenow', valeur);
		  $('.w-100').text(  (currentIndex + 1) + ' / ' + total + ' (題)');
		  $('div#qa-stat').html('選擇：'+sel_cnt+' 是非：'+(total-sel_cnt)+' (題)');
        }