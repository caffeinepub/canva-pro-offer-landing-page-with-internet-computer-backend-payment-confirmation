import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Submission {
    id: SubmissionId;
    paymentStatus: PaymentStatus;
    owner: Principal;
    name: string;
    plan: string;
    whatsapp: string;
    email: string;
    timestamp: bigint;
    paymentDate?: bigint;
    paymentTime?: bigint;
    renewalDate?: bigint;
}
export type SubmissionId = bigint;
export enum PaymentStatus {
    pending = "pending",
    paid = "paid"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createSubmission(name: string, email: string, whatsapp: string): Promise<SubmissionId>;
    getAllSubmissions(): Promise<Array<Submission>>;
    getCallerUserRole(): Promise<UserRole>;
    getRemainingUrgencySlots(): Promise<bigint>;
    getStaticConfigInstructions(): Promise<string>;
    getSubmissionById(submissionId: SubmissionId): Promise<Submission | null>;
    isCallerAdmin(): Promise<boolean>;
    markAsPaid(submissionId: SubmissionId): Promise<void>;
}
