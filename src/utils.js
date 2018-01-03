/**
 * 建立了新的socket连接后，记录相应socketId
 */
function addSocketId(users, info) {
    const { userId, socketId, userName, productId, onCallStatu } = info;

    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        if (user.userId === userId) {
            if (user.socketIds.indexOf(socketId) === -1) {
                user.socketIds.push(socketId);
            }
            return;
        }
    }

    users.push({
        userId,
        socketIds: [socketId],
        userName,
        productId,
        onCallStatu
    });
}

/**
 * 通过给定的userId获取socketId
 */
function getSocketId(users, userId) {
    // 同一用户会打开多个页面，存在多个socketId
    let result = [];
    users.forEach(user => {
        if (user.userId === userId) {
            result = user.socketIds;
        }
    });
    return result;
}

/**
 * 通过给定的userId获取appSocketId
 */
function getAppSocketId(users, userId) {
    let result = '';
    users.forEach(user => {
        if (user.userId === userId) {
            user.socketIds.forEach(socketId => {
                if(socketId.indexOf('/app#')>-1){
                    result = socketId;
                }
            })
        }
    });
    return result;
}

/**
 * 关闭页面后，删除对应的socketId
 */
function deleteSocketId(users, socketId) {
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        let sidIdx = user.socketIds.indexOf(socketId);
        if (sidIdx > -1) {
            user.socketIds.splice(sidIdx, 1);
            if (user.socketIds.length === 0) {
                users.splice(i, 1);
                break;
            }
        }
    }
    return;
}

module.exports = {
    getSocketId,
    getAppSocketId,
    addSocketId,
    deleteSocketId
};
