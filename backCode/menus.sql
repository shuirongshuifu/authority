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

 Date: 09/01/2023 14:37:41
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for menus
-- ----------------------------
DROP TABLE IF EXISTS `menus`;
CREATE TABLE `menus`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '唯一id',
  `pid` int(11) NOT NULL COMMENT '上级父节点的id，即为parentId（注意，children字段是不用存储，children字段是递归时，添加进去的）',
  `pids` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '上级节点的id数组转的字符串',
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '树节点的名字',
  `url` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '即为菜单的path',
  `cUrl` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '当访问url时，前端路由需要读取并渲染的.vue文件的路径，一般是相对于views里的',
  `type` int(255) NULL DEFAULT NULL COMMENT 'type为1是菜单，为2是按钮',
  `icon` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '菜单的图标名',
  `sort` int(255) NULL DEFAULT NULL COMMENT '菜单的上下排序',
  `status` int(255) NULL DEFAULT NULL COMMENT '是否开启字段，1是开启，2是关闭',
  `isHidden` int(255) NULL DEFAULT NULL COMMENT '是否隐藏菜单，1是显示，2是隐藏',
  `isCache` int(255) NULL DEFAULT NULL COMMENT '是否缓存，1是缓存，2是不缓存',
  `remark` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NULL DEFAULT NULL COMMENT '备注',
  `isDel` int(255) NULL DEFAULT 1 COMMENT '删除标识，1代表未删除可用，2代表已删除不可用',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 105 CHARACTER SET = utf8 COLLATE = utf8_unicode_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of menus
-- ----------------------------
INSERT INTO `menus` VALUES (1, 0, NULL, 'PC', NULL, NULL, 1, NULL, NULL, 1, NULL, NULL, NULL, 1);
INSERT INTO `menus` VALUES (15, 1, '1', 'Vue', 'vueQ', 'vue', 1, 'null', 1, 1, 1, 1, '1', 2);
INSERT INTO `menus` VALUES (16, 1, '1', 'React', 'react', 'react', 1, NULL, 1, 1, 1, 1, '1', 2);
INSERT INTO `menus` VALUES (17, 15, '1,15', 'Vuex', 'vuexUrl', 'vuexCUrl', 1, 'null', 2, 1, 1, 1, '2', 1);
INSERT INTO `menus` VALUES (18, 16, '1,16', 'ReactX', 'ReactX', 'ReactX', 1, NULL, 1, 1, 1, 1, '1', 1);
INSERT INTO `menus` VALUES (19, 1, '1', '前端框架', '前端框架', '前端框架', 1, 'null', 0, 1, 1, 1, '', 1);
INSERT INTO `menus` VALUES (20, 1, '1', '后端两大框架', '后端两大框架', '后端两大框架', 1, 'null', 2, 2, 1, 1, 'null', 2);
INSERT INTO `menus` VALUES (21, 19, '1,19', 'vue页面', '/vue', '/frontend/vue.vue', 1, 'null', 0, 1, 1, 1, '', 1);
INSERT INTO `menus` VALUES (22, 19, '1,19', 'react页面', '/react', '/frontend/react.vue', 1, 'null', 0, 1, 1, 1, '', 1);
INSERT INTO `menus` VALUES (23, 19, '1,19', 'angular页面', '/angular', '/pages/angular.vue', 1, NULL, NULL, 1, 1, 1, NULL, 2);
INSERT INTO `menus` VALUES (25, 99, '1,99', '角色管理', '/role', '/system/role.vue', 1, 'null', 1, 1, 1, 1, '', 1);
INSERT INTO `menus` VALUES (26, 99, '1,99', '菜单管理', '/menu', '/system/menu.vue', 1, 'null', 2, 1, 1, 1, '', 1);
INSERT INTO `menus` VALUES (27, 19, '1,19', 'angular', '/angular', '/viewLayer.vue', 1, 'null', 0, 1, 1, 1, '/viewLayer.vue | /frontend/angular.vue', 1);
INSERT INTO `menus` VALUES (30, 21, '1,19,21', '新增vue', 'null', 'null', 2, 'null', 0, 1, 1, 1, 'null', 1);
INSERT INTO `menus` VALUES (31, 21, '1,19,21', '编辑vue', 'null', 'null', 2, 'null', 0, 1, 1, 1, 'null', 1);
INSERT INTO `menus` VALUES (32, 22, '1,19,22', '新增react', 'null', 'null', 2, 'null', 0, 1, 1, 1, 'null', 1);
INSERT INTO `menus` VALUES (33, 22, '1,19,22', '编辑react', 'null', 'null', 2, 'null', 0, 1, 1, 1, 'null', 1);
INSERT INTO `menus` VALUES (34, 27, '1,19,27', 'agl1', '/agl1', '/frontend/aglOne.vue', 1, 'null', 0, 1, 1, 1, 'null', 1);
INSERT INTO `menus` VALUES (35, 27, '1,19,27', 'agl2', '/agl2', '/frontend/aglTwo.vue', 1, 'null', 1, 1, 1, 1, 'null', 1);
INSERT INTO `menus` VALUES (36, 1, '1', '后端框架', '后端框架', '后端框架', 1, 'null', 1, 1, 1, 1, 'null', 1);
INSERT INTO `menus` VALUES (37, 36, '1,36', 'springBoot', '/springBoot', '/backend/springBoot.vue', 1, NULL, NULL, 1, 1, 1, NULL, 1);
INSERT INTO `menus` VALUES (38, 36, '1,36', 'myBatis', '/myBatis', '/backend/myBatis.vue', 1, 'null', 0, 1, 1, 1, 'null', 1);
INSERT INTO `menus` VALUES (39, 34, '1,19,27,34', 'agl1新增/编辑', 'null', 'null', 2, 'null', 0, 1, 1, 1, 'null', 1);
INSERT INTO `menus` VALUES (40, 34, '1,19,27,34', 'agl1删除', 'null', 'null', 2, 'null', 0, 1, 1, 1, 'null', 1);
INSERT INTO `menus` VALUES (41, 21, '1,19,21', '删除vue', 'null', 'null', 2, 'null', 3, 1, 1, 1, 'null', 1);
INSERT INTO `menus` VALUES (42, 21, '1,19,21', '占位按钮', NULL, NULL, 2, NULL, NULL, 1, 1, 1, NULL, 1);
INSERT INTO `menus` VALUES (99, 1, '1', '系统设置', '系统设置', '系统设置', 1, 'null', 2, 1, 1, 1, '', 1);
INSERT INTO `menus` VALUES (100, 36, '1,36', '特工001', '/dynaOne/:001', '/backend/dynamicComponent.vue', 1, 'null', 2, 1, 1, 1, '动态路由组件，多个路由共用一个组件', 1);
INSERT INTO `menus` VALUES (101, 36, '1,36', '特工002', '/dynaTwo/:002', '/backend/dynamicComponent.vue', 1, 'null', 3, 1, 1, 1, '/backend/dynamicComponent.vue这个组件是公共的路由组件', 1);

SET FOREIGN_KEY_CHECKS = 1;
