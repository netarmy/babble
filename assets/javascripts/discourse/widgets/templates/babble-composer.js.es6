import { h } from 'virtual-dom'

export default Ember.Object.create({
  render(widget) {
    this.widget = widget
    this.state  = widget.state
    if (Discourse.User.current()) {
      return this.composer()
    } else {
      return this.loggedOutView()
    }
  },

  composer() {
    return h('div.babble-composer-wrapper', {
      className: 'wmd-controls'
    }, [this.textarea(),
        this.uploadButton(),
        this.emojiButton(),
        this.submitButton(),
      h('form')])
  },

  textarea() {
    return h('textarea', {
      attributes: {
        'babble-composer': 'inactive',
        placeholder: Discourse.SiteSettings.babble_placeholder || I18n.t('babble.placeholder'),
        rows:        1,
        disabled:    this.state.submitDisabled
      }
    }, this.state.raw)
  },

  emojiButton() {
    return this.widget.attach('button', {
      className: 'emoji-button',
      icon: 'smile-o',
      action: 'selectEmoji'
    })
  },

  uploadButton() {
    return this.widget.attach('button', {
      className: 'upload-button',
      icon: 'upload',
      action: 'showUploadModal'
    })
  },

  submitButton() {
    return this.widget.attach('button', {
      className: 'submit-button',
      icon: 'reply',
      action: 'submit'
    })
  },

  loggedOutView() {
    return [
      h('div.babble-logged-out-message', I18n.t('babble.logged_out')),
      this.widget.attach('header-buttons', {
        canSignUp: this.widget.attrs.canSignUp,
        showLogin: null,
        showSignUp: null,
      })
    ]
  }
})
