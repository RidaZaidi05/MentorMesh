import React from 'react';

const DeleteNotification = ({ userId }) => {
    const deleteNotification = async (userId) => {
        try {
            const deleteResponse = await fetch(`${process.env.BACKEND_URL}/deleteNotifications/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: ['like', 'comment'] // Specify actions to delete
                })
            });

            if (!deleteResponse.ok) {
                throw new Error("Failed to delete notifications");
            }
        } catch (error) {
            console.error("Error deleting notifications:", error.message);
            // Handle error (e.g., show error message to user)
        }
    };

    React.useEffect(() => {
        deleteNotification(userId);
    }, [userId]);

    return null;
};

export default DeleteNotification;
