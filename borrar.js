<script   src="https://code.jquery.com/jquery-2.2.4.min.js"   integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44="   crossorigin="anonymous"></script>

$(function() 
{
$("#button").click( function()
{
   //var TXT_URL = 'https://www.mozilla.org/media/MPL/2.0/index.815ca599c9df.txt';
   var TXT_URL = $("#input-url").val();

    $.ajax
    (
    	{
        	url : TXT_URL,
			dataType: "text",
			success : function (data) 
			{
            	$(".text").html("<pre>"+data+"</pre>");
			}
		}
	);
   });
});
