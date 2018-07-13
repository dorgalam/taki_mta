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
        <fieldset>
          <legend>formname</legend>
          {this.props.fields.map(field => (
            <p key={field}>
              <label htmlFor={field}>
                {field}:{' '}
                <input
                  name={field}
                  onChange={e => this.setState({ [field]: e.target.value })}
                />
              </label>
            </p>
          ))}
        </fieldset>
        <input type="submit" />
      </form>
    );
  }
}
