import React from 'react';

import {Modal} from '../../components/UI/Modal/Modal';
import Aux from '../Aux/Aux';

const withErrorHandler = ( WrappedComponent, axios) =>{
    return class extends React.Component{               //anonymous class
        state = {
            error: null
        }

        componentWillMount(){                           //will mount used to use HOC before child comp. are rendered to catch errore, can also use constructors
            this.reqinterceptor = axios.interceptors.request.use(req=>{
                this.setState({error: null})
                return req;
            });
            this.resInterceptor = axios.interceptors.response.use(res=>res , error=>{
                this.setState({error: error})
            });
        }

        componentWillUnmount(){
            axios.interceptors.request.eject(this.reqinterceptor);
            axios.interceptors.response.eject(this.resInterceptor);
        }

        render(){
            return(
                <Aux>
                    <Modal show={this.state.error}
                            modalClosed={()=>this.setState({error: null})} >
                        {this.state.error ? this.state.error.message: null}
                    </Modal>
                    <WrappedComponent {...this.props}/>
                </Aux>

            );
        }
    }
}

export default withErrorHandler;
