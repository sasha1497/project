-----------------Users table---------------------------
CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `confirmPassword` varchar(255) DEFAULT NULL,
  `gender` enum('male','female','other') NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `height` int(11) DEFAULT NULL,
  `job` varchar(100) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `whatsapp` varchar(20) DEFAULT NULL,
  `monthlySalary` int(11) DEFAULT NULL,
  `weight` int(11) DEFAULT NULL,
  `religion` varchar(100) DEFAULT NULL,
  `caste` varchar(100) DEFAULT NULL,
  `mother_tongue` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `district` varchar(100) DEFAULT NULL,
  `state` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `marital_status` enum('never_married','divorced','widowed') DEFAULT 'never_married',
  `education` varchar(150) DEFAULT NULL,
  `occupation` varchar(150) DEFAULT NULL,
  `income` varchar(100) DEFAULT NULL,
  `about_me` text DEFAULT NULL,
  `photo` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `count` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `person` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone_number` (`phone_number`);

ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;


------------payaments-------------
CREATE TABLE `payments` (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `user_id` char(36) DEFAULT NULL,
  `plan_id` char(36) DEFAULT NULL,
  `razorpay_payment_id` varchar(100) DEFAULT NULL,
  `method` varchar(50) DEFAULT NULL,
  `status` smallint(6) NOT NULL,
  `amount` int(11) NOT NULL,
  `currency` varchar(3) DEFAULT 'INR',
  `signature` varchar(255) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `contact` varchar(20) DEFAULT NULL,
  `captured` tinyint(1) DEFAULT 0,
  `country_code` varchar(2) DEFAULT 'IN',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE `payments`
  ADD PRIMARY KEY (id);


------payment_plans-------------------
CREATE TABLE payment_plans (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `price` int(11) NOT NULL,
  `currency` varchar(3) DEFAULT 'INR',
  `duration_days` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


ALTER TABLE `payment_plans`
  ADD PRIMARY KEY (id);


-------user_subscribtion-----------------
CREATE TABLE user_subscriptions (
  `id` char(36) NOT NULL DEFAULT uuid(),
  `user_id` char(36) DEFAULT NULL,
  `plan_id` char(36) DEFAULT NULL,
  `payment_id` char(36) DEFAULT NULL,
  `start_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `end_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE `user_subscriptions`
  ADD PRIMARY KEY (id);




