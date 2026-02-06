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
      backgroundColor={{ base: "#FFFFFF", _dark: "#1A202C" }}
      opacity="1"
      p={{ base: 4, md: 5 }}
      boxShadow="0 -10px 40px rgba(0, 0, 0, 0.2)"
      zIndex={10000}
      borderTop="1px solid"
      borderColor={{ base: "#EDF2F7", _dark: "#2D3748" }}
    >
      <Flex
        maxWidth="1200px"
        mx="auto"
        alignItems="center"
        justifyContent="space-between"
        direction={{ base: "column", md: "row" }}
        gap={4}
      >
        <Flex alignItems="center" gap={3}>
          <Text fontSize="xl">🚀</Text>
          <Text
            color={{ base: "gray.700", _dark: "gray.100" }}
            fontWeight="semibold"
            fontSize={{ base: "sm", md: "md" }}
          >
            {text}
          </Text>
        </Flex>
        <Flex
          gap={3}
          width={{ base: "full", md: "auto" }}
          justifyContent="flex-end"
        >
          <Button
            size="sm"
            variant="ghost"
            onClick={onCancel}
            _hover={{ bg: "gray.100", _dark: { bg: "whiteAlpha.100" } }}
          >
            {cancelText}
          </Button>
          <Button
            size="sm"
            colorScheme="blue"
            onClick={onConfirm}
            px={6}
            fontWeight="bold"
            boxShadow="sm"
            _hover={{ transform: "translateY(-1px)", boxShadow: "md" }}
            transition="all 0.2s"
          >
            {confirmText}
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};
