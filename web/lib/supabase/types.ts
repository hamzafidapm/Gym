export type ClassType = "Strength" | "HIIT" | "Boxing" | "Yoga" | "Cycle" | "Mobility";
export type ClassLevel = "L1" | "L2" | "L3";
export type Weekday = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";
export type BillingCycle = "monthly" | "annual";
export type BookingStatus = "booked" | "cancelled";

export interface Database {
  public: {
    Tables: {
      trainers: {
        Row: {
          id: string;
          name: string;
          first_name: string;
          specialty: string;
          certs: string;
          short_bio: string;
          bio: string;
          image_path: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["trainers"]["Row"], "created_at"> & {
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["trainers"]["Insert"]>;
      };
      class_categories: {
        Row: {
          id: ClassType;
          name: string;
          blurb: string;
          image_path: string;
          weekly_count: number;
          sort_order: number;
        };
        Insert: Database["public"]["Tables"]["class_categories"]["Row"];
        Update: Partial<Database["public"]["Tables"]["class_categories"]["Row"]>;
      };
      classes: {
        Row: {
          id: string;
          name: string;
          type: ClassType;
          day: Weekday;
          start_time: string;
          duration_min: number;
          trainer_id: string;
          spots_available: number;
          level: ClassLevel;
          room: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["classes"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["classes"]["Insert"]>;
      };
      plans: {
        Row: {
          id: string;
          tag: string;
          monthly_price: number;
          summary: string;
          features: string[];
          sort_order: number;
        };
        Insert: Database["public"]["Tables"]["plans"]["Row"];
        Update: Partial<Database["public"]["Tables"]["plans"]["Row"]>;
      };
      testimonials: {
        Row: {
          id: string;
          quote: string;
          member_name: string;
          meta: string;
          sort_order: number;
        };
        Insert: Omit<Database["public"]["Tables"]["testimonials"]["Row"], "id"> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["testimonials"]["Insert"]>;
      };
      gallery_items: {
        Row: {
          id: string;
          alt_text: string;
          label: string;
          image_path: string;
          object_position: string;
          sort_order: number;
        };
        Insert: Omit<Database["public"]["Tables"]["gallery_items"]["Row"], "id"> & {
          id?: string;
        };
        Update: Partial<Database["public"]["Tables"]["gallery_items"]["Insert"]>;
      };
      members: {
        Row: {
          id: string;
          first_name: string | null;
          last_name: string | null;
          phone: string | null;
          plan_id: string | null;
          cycle: BillingCycle;
          member_since: string;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["members"]["Row"],
          "cycle" | "member_since" | "created_at"
        > & {
          cycle?: BillingCycle;
          member_since?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["members"]["Insert"]>;
      };
      bookings: {
        Row: {
          id: string;
          member_id: string;
          class_id: string;
          status: BookingStatus;
          booked_at: string;
          cancelled_at: string | null;
        };
        Insert: never; // writes only go through book_class / cancel_booking RPCs
        Update: never;
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          message: string;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["contact_messages"]["Row"],
          "id" | "created_at"
        > & {
          id?: string;
          created_at?: string;
        };
        Update: never;
      };
    };
    Functions: {
      book_class: {
        Args: { p_class_id: string };
        Returns: Database["public"]["Tables"]["bookings"]["Row"];
      };
      cancel_booking: {
        Args: { p_booking_id: string };
        Returns: Database["public"]["Tables"]["bookings"]["Row"];
      };
    };
  };
}
