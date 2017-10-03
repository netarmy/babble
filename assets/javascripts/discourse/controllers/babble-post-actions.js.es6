import ModalFunctionality from 'discourse/mixins/modal-functionality'
import Babble from '../lib/babble'
import computed from 'ember-addons/ember-computed-decorators'
import { userPath } from 'discourse/lib/url'
import ApplicationRoute from 'discourse/routes/application'

export default Ember.Controller.extend(ModalFunctionality, {
  topic: null,
  post: null,
  post_name: '',
  post_quote: '',
  callbacks: {
    onShow: null,
    onDestroy: null
  },

  init() {
    this._super(...arguments)
    ApplicationRoute.reopen({
      actions: {
        closeModal: function(){
          this._super.apply(this,arguments)
          this.appEvents.trigger('babble-dmodal:closed')
        }
      }
    })
    this.appEvents.on('babble-dmodal:closed',()=>{
      this.onDestroy()
    })
  },

  @computed('post_name')
  post_user_url(post_name) {
    return userPath(post_name)
  },

  onShow() {
    $('#discourse-modal').addClass('babble-post-actions-modal')
    if (this.get('callbacks').onShow) {
      this.get('callbacks').onShow(this)
    }
  },

  onDestroy() {
    if (this.get('callbacks').onDestroy) {
      this.get('callbacks').onDestroy()
    }
    $('#discourse-modal').removeClass('babble-post-actions-modal')
  },

  actions: {
    reply() {
      Babble.replyPost(this.get('topic'), this.get('post'))
      this.appEvents.trigger('babble-composer:rerender')
      this.send('closeModal')
    },
    edit() {
      Babble.editPost(this.get('topic'), this.get('post'))
      this.appEvents.trigger('babble-composer:rerender')
      this.send('closeModal')
    },
    delete() {
      Babble.destroyPost(this.get('topic'), this.get('post'))
      this.send('closeModal')
    }
  }
})