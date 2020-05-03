export const updateObjects = (oldObject, updatedProperties)=>{
    return{
        ...oldObject,
        ...updatedProperties
    };
};