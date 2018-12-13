import _ from 'lodash'
import React from 'react'
import PT from 'prop-types'
import moment from 'moment'
import Modal from 'react-modal'
import XMarkIcon from  '../../assets/icons/icon-x-mark.svg'
import Avatar from 'appirio-tech-react-components/components/Avatar/Avatar'
import { getAvatarResized } from '../../helpers/tcHelpers'

class Dialog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      inviteText: '',
      validInviteText: false,
      clearText: false,
    }
    this.onInviteChange = this.onInviteChange.bind(this)
    this.sendInvites = this.sendInvites.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.clearText && nextProps.processingInvites !== this.props.processingInvites &&
      !nextProps.processingInvites) {
      this.setState({
        inviteText: '',
        validInviteText: false,
        clearText: false,
      })
    }
  }

  onInviteChange(evt) {
    const text = evt.target.value
    const emails = text.split(/[,;]/g)
    const isInvalid = emails.some(email => {
      email = email.trim()
      if (email === '') {
        return false
      }
      return !/(.+)@(.+){2,}\.(.+){2,}/.test(email)
    })
    this.setState({
      validInviteText: !isInvalid && text.length > 0,
      inviteText: evt.target.value
    })
  }

  sendInvites() {
    let emails = this.state.inviteText.split(/[,;]/g)
    emails = emails.map(email => email.trim())
    this.props.sendInvite(emails)
    this.setState({clearText: true})
  }

  render() {
    const {members, currentUser, isMember, removeMember, removeInvite,
      onCancel, invites = []} = this.props
    const showRemove = (isMember && !currentUser.isCopilot)
    let i = 0
    return (
      <Modal
        isOpen
        className="project-dialog-conatiner"
        overlayClassName="management-dialog-overlay"
        onRequestClose={onCancel}
        contentLabel=""
      >

        <div className="project-dialog">
          <div className="dialog-title">
            Project team
            <span onClick={onCancel}><XMarkIcon /></span>
          </div>

          <div className="dialog-body">
            {(members.map((member) => {
              if (!member.isCustomer) {
                return null
              }
              i++
              const remove = () => {
                removeMember(member)
              }
              const firstName = _.get(member, 'firstName', '')
              const lastName = _.get(member, 'lastName', '')
              let userFullName = `${firstName} ${lastName}`
              userFullName = userFullName.trim().length > 0 ? userFullName : 'Connect user'
              return (
                <div
                  key={i}
                  className={`project-member-layout ${(i%2 !== 0) ? 'dark' : ''}`}
                >

                  <div className="memer-details">
                    <Avatar
                      userName={userFullName}
                      avatarUrl={getAvatarResized(_.get(member, 'photoURL'), 40)}
                      size={40}
                    />
                    <div className="member-name">
                      <span className="span-name">{userFullName}</span>
                      <span className="member-handle">
                        @{member.handle || 'ConnectUser'}
                      </span>
                    </div>
                  </div>
                  {showRemove && <div className="member-remove" onClick={remove}>
                    {(currentUser.userId === member.userId) ? 'Leave' : 'Remove'}
                  </div>}
                </div>
              )
            }))}
            {(invites.map((invite) => {
              const remove = () => {
                removeInvite(invite.email)
              }
              i++
              return (
                <div
                  key={i}
                  className={`project-member-layout ${(i%2 !== 0) ? 'dark' : ''}`}
                >
                  <Avatar
                    userName={invite.email}
                    size={40}
                  />
                  <div className="member-name member-email">
                    <span>
                      {invite.email}
                    </span>
                    <span className="email-date">
                      Invited {moment(invite.time).format('MMM D, YY')}
                    </span>
                  </div>
                  {showRemove && <div className="member-remove" onClick={remove}>
                    Remove
                    <span className="email-date">
                      Invited {moment(invite.time).format('MMM D, YY')}
                    </span>
                  </div>}
                </div>
              )
            }))}
          </div>

          <div className="input-container">
            <div className="hint">invite more people</div>
            <input
              type="text"
              value={this.state.inviteText}
              onInput={this.onInviteChange}
              placeholder="Enter one or more emails separated by ';' or comma ','"
              className="tc-file-field__inputs"
              disabled={!isMember || this.state.clearText}
            />
            <button
              className="tc-btn tc-btn-primary tc-btn-md"
              onClick={this.sendInvites}
              disabled={!this.state.validInviteText || this.state.clearText}
            >
              Send Invite
            </button>
          </div>
        </div>

      </Modal>
    )
  }
}

Dialog.propTypes = {
  processingInvites: PT.bool.isRequired,
  currentUser: PT.object.isRequired,
  members: PT.arrayOf(PT.object).isRequired,
  isMember: PT.bool.isRequired,
  onCancel: PT.func.isRequired,
  removeMember: PT.func.isRequired,
  invites: PT.arrayOf(PT.object),
  sendInvite: PT.func.isRequired,
  removeInvite: PT.func.isRequired,
}

export default Dialog
