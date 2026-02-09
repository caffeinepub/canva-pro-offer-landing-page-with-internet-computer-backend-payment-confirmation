import Time "mo:core/Time";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type SubmissionId = Nat;
  type PaymentStatus = { #pending; #paid };
  type Slot = { #available; #used };

  module Submission {
    type T = Submission;
    public func compare(a : T, b : T) : Order.Order {
      Int.compare(a.timestamp, b.timestamp);
    };
  };

  public type Submission = {
    id : SubmissionId;
    timestamp : Int;
    name : Text;
    email : Text;
    whatsapp : Text;
    paymentStatus : PaymentStatus;
    paymentDate : ?Int;
    paymentTime : ?Int;
    plan : Text;
    renewalDate : ?Int;
    owner : Principal;
  };

  // Storage
  let submissions = Map.empty<SubmissionId, Submission>();
  var nextSubmissionId : SubmissionId = 0;

  // Urgency Slots
  let totalUrgencySlots = 3;
  var remainingUrgencySlots = totalUrgencySlots;
  var lastSlotResetTime : Int = 0;

  // EXPIRATION WINDOW CONSTANTS
  let slotResetInterval3600 = 3_600_000_000_000; // 1 hour (nanoseconds)

  // CREATE SUBMISSION (Lead Capture)
  // No authentication required - lead capture forms must be accessible to anonymous visitors
  public shared ({ caller }) func createSubmission(name : Text, email : Text, whatsapp : Text) : async SubmissionId {
    let submissionId = nextSubmissionId;
    nextSubmissionId += 1;

    let newSubmission : Submission = {
      id = submissionId;
      timestamp = Time.now();
      name;
      email;
      whatsapp;
      paymentStatus = #pending;
      paymentDate = null;
      paymentTime = null;
      plan = "₹299 / 1 year Canva Pro";
      renewalDate = null;
      owner = caller;
    };

    submissions.add(submissionId, newSubmission);
    submissionId;
  };

  // MARK SUBMISSION AS PAID
  // Only the owner of the submission or an admin can mark it as paid
  public shared ({ caller }) func markAsPaid(submissionId : SubmissionId) : async () {
    let currentTime = Time.now();
    let renewalTime = currentTime + (365 * 24 * 60 * 60 * 1_000_000_000);

    switch (submissions.get(submissionId)) {
      case (null) { Runtime.trap("Submission not found") };
      case (?submission) {
        // Authorization: Only the owner or an admin can mark as paid
        if (caller != submission.owner and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the submission owner or admin can mark as paid");
        };

        let updatedSubmission : Submission = {
          id = submission.id;
          timestamp = submission.timestamp;
          name = submission.name;
          email = submission.email;
          whatsapp = submission.whatsapp;
          paymentStatus = #paid;
          paymentDate = ?currentTime;
          paymentTime = ?currentTime;
          plan = submission.plan;
          renewalDate = ?renewalTime;
          owner = submission.owner;
        };
        submissions.add(submissionId, updatedSubmission);

        // Update urgency slots
        var slotsToDecrement = 1;
        // Reset slots if interval passed since last reset
        if (currentTime - lastSlotResetTime >= slotResetInterval3600) {
          lastSlotResetTime := currentTime;
          remainingUrgencySlots := totalUrgencySlots;
          if (remainingUrgencySlots < slotsToDecrement) {
            slotsToDecrement -= remainingUrgencySlots;
            // This should be 0 or 1, if it's 1, it means we've crossed the reset boundary
          };
        };

        remainingUrgencySlots := if (remainingUrgencySlots > slotsToDecrement) {
          remainingUrgencySlots - slotsToDecrement;
        } else { 0 };
      };
    };
  };

  // GET REMAINING URGENCY SLOTS
  // Public information - no authentication required
  public query ({ caller }) func getRemainingUrgencySlots() : async Nat {
    remainingUrgencySlots;
  };

  // GET ALL SUBMISSIONS (Admin Only)
  public query ({ caller }) func getAllSubmissions() : async [Submission] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all submissions");
    };

    submissions.values().toArray().sort();
  };

  // GET SUBMISSION BY ID
  // Only the owner or an admin can view a specific submission
  public query ({ caller }) func getSubmissionById(submissionId : SubmissionId) : async ?Submission {
    switch (submissions.get(submissionId)) {
      case (null) { null };
      case (?submission) {
        // Authorization: Only the owner or an admin can view this submission
        if (caller != submission.owner and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the submission owner or admin can view this submission");
        };
        ?submission;
      };
    };
  };

  // FRONTEND STATIC CONFIGURATION (for documentation)
  public shared ({ caller }) func getStaticConfigInstructions() : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view static config instructions");
    };

    "CONFIGURATION INSTRUCTIONS:\n" # "1. Store the payment link as a constant in the frontend UI code.\n" # "2. Store the payment QR image as a static asset on the frontend.\n" # "3. Deploy the Motoko backend with dfx deploy.";
  };

  public query ({ caller }) func helloWorld() : async Text {
    "Hello World!";
  };
};
