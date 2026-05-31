import { API } from "stoat.js";

/**
 * Translate any error
 */
export function useError() {
  return (error: unknown) => {
    // TODO: HTTP errors

    // Attempt to parse the incoming error as JSON if it is a string,
    // as some errors (e.g on login) are sent to this function as a string,
    // which then causes the error message to be unlocalised and unhelpful.
    if (typeof error === "string") {
      try {
        error = JSON.parse(error);
      } catch {
        // Ignore JSON parse errors
      }
    }

    // handle Revolt API errors
    if (
      (error as { type?: never } | undefined)?.type &&
      typeof (error as { type: never }).type === "string"
    ) {
      const err = error as
        | API.Error
        | Exclude<
            API.Authifier_Error,
            | { type: "UnknownUser" }
            | { type: "DatabaseError" }
            | { type: "InternalError" }
          >;

      switch (err.type) {
        case "AlreadyFriends":
          return "Already friends with this user.";
        case "AlreadyInGroup":
          return "You're already part of this group.";
        case "AlreadyInServer":
          return "You're already part of this server.";
        case "AlreadyOnboarded":
          return "Your user has already been created? Try logging in again or refreshing the app.";
        case "AlreadyPinned":
          return "This message is already pinned.";
        case "AlreadySentRequest":
          return "You've already sent a request to this user.";
        case "Banned":
          return "You are banned from this server.";
        case "Blocked":
          return "You have this user blocked.";
        case "BlockedByOther":
          return "This user has blocked you.";
        case "BotIsPrivate":
          return "This bot is private and can only be added by the creator.";
        case "CannotEditMessage":
          return "Cannot edit this message.";
        case "CannotGiveMissingPermissions":
          return "You cannot give yourself missing permissions.";
        case "CannotJoinCall":
          return "You cannot join this call.";
        case "CannotRemoveYourself":
          return "You cannot remove yourself.";
        case "CannotReportYourself":
          return "You cannot report yourself.";
        case "CannotTimeoutYourself":
          return "You cannot timeout yourself.";
        case "DatabaseError":
          return `Database error, please contact support. (${err.location})`;
        case "DiscriminatorChangeRatelimited":
          return "Your discriminator change has been ratelimited, please try again later.";
        case "DuplicateNonce":
          return "This has already been sent.";
        case "EmptyMessage":
          return "This message is empty and has not been sent.";
        case "FailedValidation":
          return `Something is wrong with your request, ${err.error}.`;
        case "FeatureDisabled":
          return "This feature is currently disabled.";
        case "FileTypeNotAllowed":
          return "This file type is not allowed.";
        case "GroupTooLarge":
          return `This group is too large, you can have up to ${err.max} users.`;
        case "ImageProcessingFailed":
          return "Failed to process the image you provided.";
        case "InternalError":
          return `An internal error occurred. (${err.location})`;
        case "InvalidCredentials":
          return "Provided email or password is wrong.";
        case "InvalidSession":
          return "Please log in again.";
        case "InvalidUsername":
          return "This username is not allowed.";
        case "MissingPermission":
        case "MissingUserPermission":
          return "You do not have permission to do this.";
        case "NoEffect":
          return "That action had no effect.";
        case "NotElevated":
          return "Your role ranking is too low to take this action.";
        case "NotFound":
          return "Could not find what you requested.";
        case "ReachedMaximumBots":
          return "You've reached your personal bot limit.";
        case "UsernameTaken":
          return "This username is already taken.";
        case "TooManyEmoji":
          return `You can't have more than ${err.max} emojis on this server.`;
        case "TooManyChannels":
          return `You can't have more than ${err.max} channels on this server.`;
        case "TooManyServers":
          return `You can't be in more than ${err.max} servers, please leave one and try again.`;
        case "TooManyPendingFriendRequests":
          return `You've sent too many friend requests, the maximum is ${err.max}`;
        case "PayloadTooLarge":
          return "Your message is too long, please remove some characters and try again.";
        case "ShortPassword":
          return "The password is too short.";
        case "LockedOut":
          return "You have been locked out for entering a wrong password multiple times. Please wait a couple minutes and try again.";
        case "CompromisedPassword":
          return "This password has previously appeared in security leaks, please use another password.";
        case "UnverifiedAccount":
          return "This account is not activated! Please check your account's inbox and try again.";
        case "TotpAlreadyEnabled":
          return "Multi-factor authentication is already enabled for this account.";

        // unreachable errors (in theory)
        case "FileTooLarge":
        case "FileTooSmall":
        case "InvalidFlagValue":
        case "InvalidOperation":
        case "InvalidProperty":
        case "InvalidRole":
        case "IsBot":
        case "IsNotBot":
        case "LabelMe":
        case "NoEmbedData":
        case "NotAuthenticated":
        case "NotFriends":
        case "NotInGroup":
        case "NotOwner":
        case "NotPinned":
        case "NotPrivileged":
        case "ProxyError":
        case "TooManyAttachments": // todo: maybe handle these:
        case "TooManyEmbeds":
        case "TooManyReplies":
        case "TooManyRoles": // ... to here
        case "UnknownAttachment":
        case "UnknownChannel":
        case "UnknownMessage":
        case "UnknownServer":
        case "UnknownUser":
        case "VosoUnavailable":
          return err.type + " " + err.location;

        default:
          return `Uncaught Stoat error: ${err.type}`;
      }
    }

    // pass-through pre-localised errors with new Error({ message: <> })
    if (
      (error as { message?: never } | undefined)?.message &&
      typeof (error as { message: never }).message === "string"
    ) {
      const message = (error as { message: string }).message.trim();
      if (message) return message;
    }

    return `Something went wrong! ${error}`;
    // revert to `Try again later.` later
    // need to capture envelopes properly
  };
}
