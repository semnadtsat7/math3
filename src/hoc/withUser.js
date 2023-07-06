import React from 'react';
import Firebase from './../utils/Firebase';

function bind (Target)
{
    return class extends React.Component
    {
        constructor (props)
        {
            super (props);

            this.state = 
            {
                isAuth: false,
            }

            this.unsubscribes = [];
        }

        componentDidMount ()
        {
            const { history } = this.props;
            const auth = Firebase.auth();

            this.unsubscribes[0] = auth.onAuthStateChanged(user =>
            {
                if(user)
                {
                    this.setState ({ isAuth: true });
                }
                else
                {
                    history.replace(`/sign-in?redirect=${encodeURIComponent(history.location.pathname + history.location.search)}`);
                }
            });
        }

        componentWillUnmount ()
        {
            this.unsubscribes.forEach(unsubscribe =>
            {
                if(unsubscribe)
                {
                    unsubscribe ();
                }
            });
        }

        render ()
        {
            return (
                <Target {...this.props} {...this.state} />
            )
        }
    }
}

export default bind;