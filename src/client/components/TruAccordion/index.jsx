import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { observer } from 'mobx-react'
import { makeObservable, observable } from 'mobx'

@observer
class TruAccordion extends React.Component {
  @observable expanded = false
  @observable expandedContentShown = false

  constructor (props) {
    super(props)

    makeObservable(this)
    this.headerRef = React.createRef(); // Ref for the header to manage focus
  }

  componentDidMount () {
    this.expanded = this.props.startExpanded
    this.expandedContentShown = this.props.startExpanded
  }

  onHeaderClick = e => {
    e.preventDefault()
    if (this.expanded === false) this.expandedContentShown = true
    setTimeout(() => {
      this.expanded = !this.expanded
    }, 10)

    setTimeout(() => {
      this.expandedContentShown = this.expanded
      if (this.expanded) {
        this.headerRef.current.focus(); // Focus the header when expanded
      }
    }, 300)

    if (this.props.onExpandedChange) this.props.onExpandedChange(this.expanded)
  }

  onKeyDown = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      this.onHeaderClick(e);
    }
  }

  render () {
    const { headerContent, content, contentPadding } = this.props
    const contentStyle = {}
    if (typeof contentPadding !== 'undefined') contentStyle.padding = contentPadding

    return (
      <div className={clsx('truaccordion-wrapper', this.expanded && 'expanded')}>
        <div className={'truaccordion-header'}
             role={'button'}
             tabIndex={0} // Make the header focusable
             onClick={e => this.onHeaderClick(e)}
             onKeyDown={this.onKeyDown} // Allow keyboard interaction
             ref={this.headerRef}
             aria-expanded={this.expanded} // ARIA state for expanded or collapsed
             aria-controls="truaccordion-content"> 
          <div className={'truaccordion-header-content'}>
            <h4>{headerContent}</h4>
            <div className={'arrow'}>
              <span>
                <i className={'material-icons'}>chevron_right</i>
              </span>
            </div>
          </div>
        </div>
        {this.expandedContentShown && (
          <div id="truaccordion-content" className={'truaccordion-content'} aria-hidden={!this.expanded}>
            <div className={'truaccordion-content-inner'} style={contentStyle}>
              {content}
            </div>
          </div>
        )}
      </div>
    )
  }
}

TruAccordion.propTypes = {
  startExpanded: PropTypes.bool,
  onExpandedChange: PropTypes.func,
  contentPadding: PropTypes.number,
  headerContent: PropTypes.string.isRequired,
  content: PropTypes.node.isRequired
}

TruAccordion.defaultProps = {
  startExpanded: false
}

export default TruAccordion
