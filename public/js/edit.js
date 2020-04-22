var title;
var to_be_edited;
        $(document).ready(function() {
            $('#myTable').DataTable();
            });
        // edit data
        $('.edit').click(function() {
            id= this.id;
                $.ajax({
                    type: 'POST',
                    url: '/find_by_title',
                    data: {"title":id},
                    success: function(data){
                            to_be_edited = data[0].title;
                            $("#edit_title").attr("value", data[0].title);
                            $("#edit_description").attr("value", data[0].description);
                            $("#edit_url").attr("value", data[0].url);
                            $("#edit_img").attr("value", data[0].img);
                            $("#edit_date").attr("value", data[0].date);
                            $('#Modal').modal({show: true});
                        },
                    error: function(){
                        alert('No data');
                    }
                    });
            });




            
            // update data
                  $(function(){
                      $('#edit_table').on('click', function(e){
                        console.log('i am indsd');
                        var data = $('#edit_article').serialize();
                        debugger;
                        console.log(JSON.stringify(data));
                        e.preventDefault();
                        $.ajax({
                          url: '/edit_article',
                          type:'PUT',
                          data : data,
                          success: function(data){
                            console.log('i am googleapis');
                            window.location.reload()
                        },
                        error: function(){
                          alert('No data');
                        }
                      });
                  });
                  });