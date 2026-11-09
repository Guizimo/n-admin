CREATE INDEX `role_permissions_role_id_idx` ON `role_permissions` (`role_id`);--> statement-breakpoint
CREATE INDEX `role_permissions_permission_id_idx` ON `role_permissions` (`permission_id`);--> statement-breakpoint
CREATE INDEX `system_logs_created_at_idx` ON `system_logs` (`created_at`);--> statement-breakpoint
CREATE INDEX `system_logs_level_created_at_idx` ON `system_logs` (`level`,`created_at`);--> statement-breakpoint
CREATE INDEX `system_logs_module_created_at_idx` ON `system_logs` (`module`,`created_at`);--> statement-breakpoint
CREATE INDEX `system_logs_user_id_created_at_idx` ON `system_logs` (`user_id`,`created_at`);--> statement-breakpoint
CREATE INDEX `system_logs_ip_created_at_idx` ON `system_logs` (`ip`,`created_at`);--> statement-breakpoint
CREATE INDEX `users_role_id_idx` ON `users` (`role_id`);--> statement-breakpoint
CREATE INDEX `users_status_idx` ON `users` (`status`);--> statement-breakpoint
CREATE INDEX `users_created_at_idx` ON `users` (`created_at`);