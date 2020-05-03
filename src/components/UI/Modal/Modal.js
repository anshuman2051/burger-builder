import React from 'react';
import classes from './Modal.module.css';

import Aux from '../../../hoc/Aux/Aux';
import BackDrop from '../Backdrop/Backdrop';

class Modal extends React.Component{
    shouldComponentUpdate(nextProps, nextState){
       return this.props.show !== nextProps.show || nextProps.children !== this.props.children; 
    }

    componentDidUpdate(){
        console.log("summary will update");
    }
    render(){
            return(
                <Aux>
                    <BackDrop show={this.props.show} clicked={this.props.modalClosed}/>
                    <div 
                        className={classes.Modal}
                        style = {{
                            transform : this.props.show ? "translateY(0)" : "translateY(-100vh)",
                            opacity: this.props.show ? "1" : "0"
                        }}
                    >
                        {this.props.children}
                    </div>
                </Aux>
            );
    }
}

export {Modal};