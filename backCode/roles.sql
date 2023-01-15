/*
 Navicat Premium Data Transfer

 Source Server         : lss
 Source Server Type    : MySQL
 Source Server Version : 50562
 Source Host           : localhost:3306
 Source Schema         : xiyouji

 Target Server Type    : MySQL
 Target Server Version : 50562
 File Encoding         : 65001

 Date: 09/01/2023 14:37:53
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for roles
-- ----------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles`  (
  `roleId` int(255) NOT NULL AUTO_INCREMENT COMMENT '每一个角色的id',
  `roleName` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '每一个角色的name名字',
  `roleRemark` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '角色的备注',
  `menuIds` text CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL COMMENT '当前的这个角色能看到（勾选）的菜单的id（给角色赋予菜单）',
  PRIMARY KEY (`roleId`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 32 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of roles
-- ----------------------------
INSERT INTO `roles` VALUES (29, '超级管理员', '能看到所有', '1,19,21,42,30,31,41,22,32,33,27,34,39,40,35,36,37,38,100,101,99,25,26');
INSERT INTO `roles` VALUES (30, '前端', '只能看前端相关', '1,19,21,42,30,31,41,22,32,33,27,34,39,40,35');
INSERT INTO `roles` VALUES (31, '后端', '只能看后端相关', '1,36,37,38,100,101');

SET FOREIGN_KEY_CHECKS = 1;
