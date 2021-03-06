define(['jquery', 'sweetAlert'], function($, sweetAlert) {
    function createTopic() {
        if (!(this instanceof createTopic)) {
            return new createTopic();
        }
        this.$inner = $('.textarea-wrapper');
        this.$outer = $('.preview-wrapper');
        this.$modal = $('#reply-control');

        this._init();
    }

    createTopic.prototype = {
        constructor: createTopic,
        _init: function() {
            var self = this;
            this.$toggleDiv = $('.toggle-preview');
            this.$cancel = $('.cancel');
            this.$toggler = $('.toggler');
            this.$createButton = $('.create');

            this.$toggleDiv.click(function(e) {
                self.previewToggle();
            });

            this.$toggler.click(function(e) {
                e.preventDefault();
                self.closeModal();
            });

            this.$cancel.click(function(e) {
                self.closeModal();
            });

            this.$createButton.click(function(e) {
                self.create();
            });
        },

        closeModal: function(){
            this.$modal.addClass('hide');
        },

        openModal: function(callback){
            this.$modal.removeClass('hide');
            if (typeof callback !== 'undefined') {
                callback();
            }
        },

        previewToggle: function(){
            this.$modal.toggleClass('hide-preview');
            if (this.$modal.hasClass('hide-preview') === true) {
                this.$toggleDiv.html('显示预览 »');
            } else {
                this.$toggleDiv.html('« 关闭预览');
            }
        },

        create : function(){
            var title = $('#reply-title').val(),
                self = this,
                params, content = [];
            $('.CodeMirror-code pre span[style]').each(
                function () {
                    text = $(this).text();
                    content.push(text);
                }
            );

            if (!title.length) {
                sweetAlert({
                    title: "标题没有内容",
                    type: "error"
                });
                return
            }
            if (!content.length) {
                sweetAlert({
                    title: "正文内容太少",
                    type: "error"
                });
                return
            }
            params = {
                'title': title,
                'content': content.join('\n')
            };
            $.ajax({
                type: 'POST',
                url: '/create',
                traditional: true,
                data: params,
                dataType: "json",
                success: function(res) {
                    if (!res.ok) {
                        alert('发表成功');
                        self.closeModal();
                    }
                }
            });
        }
    };

    return createTopic;
});
