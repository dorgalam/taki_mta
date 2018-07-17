import React from 'react';

export default class Form extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    return (
      <form
        onSubmit={e => {
          e.preventDefault();
          this.props.onSubmit(this.state);
        }}
      >
        <fieldset class="Form">
          <legend>add new game</legend>
          {this.props.fields.map(field => (
            <div key={field} >
              <label htmlFor={field}>
                {field}:{' '}
                <input
                  name={field}
                  onChange={e => this.setState({ [field]: e.target.value })}
                />
              </label>
            </div>
          ))}
          <input type="submit" class="addGame" value="add game" />
        </fieldset>
      </form>
    );
  }
}
