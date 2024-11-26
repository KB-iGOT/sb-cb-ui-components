export namespace NsDiscussionV2 {
    export interface INewCommentConfig {
        show: boolean,
        showTopInfo: boolean,
        commentTreeData: {
            isFirstComment: boolean,
            commentTreeId: string,
            hierarchyPath: string[],
            entityType: string,
            entityId: string,
            workflow: string
        }
        topInfo: {
            icon: string,
            text: string
        },
        avatarPhoto: {
            show: boolean,
            size: string,
            photoUrl: string,
            name: string,
            color: string
        },
        commentBox: {
            placeholder: string
        },
        postBtn: {
            text: string
        },
        styles: any,

    }

    export interface ICommentCardActionsObj {
        show: boolean,
        showCount: boolean,
        icon: string,
    }

    export interface ICommentCardActions {
        like?: ICommentCardActionsObj,
        comments?: ICommentCardActionsObj,
        avatarPhoto?: {
            show: boolean,
            size: string,
            photoUrl: string,
            name: string,
            color: string
        },
    }

    export interface ICommentCardConfig {
        cardType: string,
        showActions: boolean,
        reportIcon?: {
            show: boolean,
            icon: string,
            successMsg: string,
            errorMsg: string,
            showToolTip: boolean,
            toolTipText: string
        },
        actions: ICommentCardActions,
        repliesSection: {
            show: boolean,
            newCommentReply?: INewCommentConfig,
            replyCardConfig?: ICommentCardConfig
        },
        noCommentsSection?: {
            text: string
        },
        newCommentReply?: INewCommentConfig
    }

    export interface ICommentWidgetData {
        newCommentSection: INewCommentConfig,
        commentsList: ICommentCardConfig,
        enrolledContent?: boolean
    }
}
