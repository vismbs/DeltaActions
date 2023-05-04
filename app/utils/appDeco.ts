export const methodList: {
    methodName: string | symbol,
    methodDesc: string,
    stringfiedMethod: string
}[] = []

export function Action(methodDesc: string) {
    return function (targetClass: Object, methodName: string | symbol, methodDescriptor: PropertyDescriptor) {
        methodList.push({
            methodName,
            methodDesc,
            stringfiedMethod: targetClass[methodName].toString()
        })
    }
}