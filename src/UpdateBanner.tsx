import { Box, Button, Flex, Text } from "@chakra-ui/react";
import React from "react";

export interface UpdateBannerProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  text?: string;
  confirmText?: string;
  cancelText?: string;
}

export const UpdateBanner: React.FC<UpdateBannerProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  text = "A new version of the application is available. Update now to get the latest features! 🚀",
  confirmText = "Update Now",
  cancelText = "Later",
}) => {
  if (!isOpen) return null;

  return (
    <Box
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      bg={{ base: "white", _dark: "gray.800" }}
      p={4}
      boxShadow="0 -2px 10px rgba(0, 0, 0, 0.1)"
      zIndex={9999}
      borderTop="1px solid"
      borderColor={{ base: "gray.200", _dark: "gray.700" }}
    >
      <Flex
        maxWidth="1200px"
        mx="auto"
        alignItems="center"
        justifyContent="space-between"
        direction={{ base: "column", md: "row" }}
        gap={4}
      >
        <Text color={{ base: "gray.800", _dark: "white" }} fontWeight="medium">
          {text}
        </Text>
        <Flex gap={3}>
          <Button size="sm" variant="ghost" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button size="sm" colorScheme="blue" onClick={onConfirm}>
            {confirmText}
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};
