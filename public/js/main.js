$(document).ready(function(){
    $('.edit_recipe').on('click', function(){
        console.dir($(this).data());
        $('#edit-form-id').val($(this).data('id'));
        $('#edit-form-name').val(this.dataset.name);
        $('#edit-form-ingredients').val($(this).data('ingredients'));
        $('#edit-form-directions').val($(this).data('directions'));
    });


    $('.delete_recipe').on('click', function(){
        var id = $(this).data('id');
        var url = '/delete/'+id;
        if (confirm('Delete Recipe?')){
            $.ajax({
                url: url,
                type: 'DELETE',
                success: function (result) {
                    console.log('Deleting Recipe...');
                    window.location.href= "/";
                },
                error: function (err) {
                    console.log(err);
                }
            });
        }
    });

});
